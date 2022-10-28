(function() {
    "use strict"
    const View = require("./View")
    const UserMaker = require("./Model/UserMaker")
    const Inven = require("./Model/Inven")
    const Map = require("./Model/Map")
    const Craft = require("./Model/Craft")
    const UserRepository = require("./Repository/UserRepository")
    const ItemRepository = require("./Repository/ItemRepository")
    const CraftRepository = require("./Repository/CraftRepository")
    const HashDto = require("./Dto/HashDto")
    const NameDto = require("./Dto/NameDto")
    const MakeUserDto = require("./Dto/MakeUserDto")
    const UserDataDto = require("./Dto/UserDataDto")
    const NameTierDto = require("./Dto/NameTierDto")

    const notExistUser = function(hash) {
        let hashDto = new HashDto(hash)
        let isExistDto = UserRepository.isExist(hashDto)
        return !isExistDto.isExist
    }

    const withItemInven = function(withItem, inven) {
        if(!inven.isExist(withItem) || inven.findItems(withItem).length > 1) {
            return View.NotHaveItem()
        }
        let item = inven.findItem(withItem)
        let nameDto = new NameDto(item.name)
        let setting = ItemRepository.getInvenInfo(nameDto)
        
        return new Inven(item.meta.inven, setting)
    }

    const busyUser = function(hash) {
        let hashDto = new HashDto(hash)
        let user = UserRepository.getBasicInfo(hashDto)
        return user.busyTime >= Date.now()
    }

    const Presenter = {
        SignUp : function(bot) {
            let {sender, hash} = bot
            if(!notExistUser(hash)) {
                return View.AlreadySignUp()
            }

            let user = new UserMaker(sender)
            let makeUserDto = new MakeUserDto(hash, user)
            UserRepository.newUser(makeUserDto)
            return View.SignUp()
        },
        Command : function(bot) {
            return View.Command()
        },
        MyInfo : function(bot) {
            let {hash} = bot
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }

            let hashDto = new HashDto(hash)
            let basicUserDto = UserRepository.getBasicInfo(hashDto)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)
            let coord = map.getLocate(basicUserDto.location).coord
            return View.MyInfo(basicUserDto.name,
                               basicUserDto.location, 
                               coord, 
                               basicUserDto.busyTime > Date.now(), 
                               basicUserDto.tier)
        },
        InvenInfo : function(bot) {
            let {hash} = bot
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            return View.InvenInfo(inven.invenInfo(), inven.invenLimit, inven.invenSpace())
        },
        MapInfo : function(bot) {
            let {hash, data} = bot
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }

            let hashDto = new HashDto(hash)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)
            let location = data || map.location
            if(!map.isExist(location)) {
                return View.NotExistMap()
            }

            let locate = map.getLocate(location)
            return View.MapInfo(location, locate.coord, locate.type, map.mapInfo(location))
        },
        CollectItem : function(bot) {
            let {hash, args} = bot
            let [item, number, withItem] = args
            number = Number(number)

            if(notExistUser(hash)) {
                return View.NotSignUp()
            } else if(busyUser(hash)) {
                return View.NowBusy()
            } else if(isNaN(number)) {
                return View.NotNumber()
            }

            let hashDto = new HashDto(hash)
            let user = UserRepository.getBasicInfo(hashDto)
            if(number <= 0 || number > user.tier * 10 + 10) {
                return View.OutOfRangeNumber()
            }

            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            let [mapInven] = map.getItems([item], [number])
            if(mapInven === false) {
                return View.LackMapItem()
            }
            
            let nameDto = new NameDto(item)
            let collectItemDto = ItemRepository.getCollectInfo(nameDto)
            let tools = inven.findTool(collectItemDto.effective)
            let tool = tools.find(v => v.meta.tier >= collectItemDto.tier && v.meta.durability >= number)
            if(!tool && collectItemDto.tier >= 1) {
                return View.CantCollectItem()
            }
            
            let time = collectItemDto.collectTime * number / (tool ? tool.meta.speed : 1)
            let inven2 = null
            if(!tool) {
                inven2 = (withItem ? itemInven : inven).putItems([item], [number])
            } else if(tool.meta.durability === number) {
                let [tempInven] = inven.getItems([tool.nick], [1])
                inven2 = (withItem ? itemInven : tempInven).putItems([item], [number])
            } else {
                inven.findItem(tool.nick).meta.durability -= number
                inven2 = (withItem ? itemInven : inven).putItems([item], [number])
            }

            if(inven2 === false) {
                return View.LackInvenSpace()
            }

            map.setItems(mapInven)
            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2.inven
            } else {
                inven.inven = inven2.inven
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)
                              .setMap(map.map)
                              .setBusyTime(Date.now() + time*1000)

            UserRepository.setUser(userDataDto)
            return View.CollectItem(item, number, time, tool, withItem)

        },
        DumpItem : function(bot) {
            let {hash, args} = bot
            let [item, number, withItem] = args
            number = Number(number)

            if(notExistUser(hash)) {
                return View.NotSignUp()
            } else if(busyUser(hash)) {
                return View.NowBusy()
            } else if(isNaN(number)) {
                return View.NotNumber()
            } else if(number <= 0) {
                return View.OutOfRangeNumber()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            let [inven2, outItems] = (withItem ? itemInven : inven).getItems([item], [number])
            if(inven2 === false) {
                return View.LackInvenItem()
            }

            let [names, numbers, metas] = Inven.splitItemInfo(outItems)
            let dumpItems = map.dumpItems(names, numbers, metas)
            map.setDumpItems(dumpItems)

            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2.inven
            } else {
                inven.inven = inven2.inven
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)
                              .setMap(map.map)

            UserRepository.setUser(userDataDto)
            return View.DumpItem(item, number, withItem)

        },
        RetrieveItem : function(bot) {
            let {hash, args} = bot
            let [item, number, withItem] = args
            number = Number(number)

            if(notExistUser(hash)) {
                return View.NotSignUp()
            } else if(busyUser(hash)) {
                return View.NowBusy()
            } else if(isNaN(number)) {
                return View.NotNumber()
            } else if(number <= 0) {
                return View.OutOfRangeNumber()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            let [mapInven, outItems] = map.retrieveItems([item], [number])
            if(mapInven === false) {
                return View.LackMapItem()
            }

            let [names, numbers, metas] = Inven.splitItemInfo(outItems)
            let inven2 = (withItem ? itemInven : inven).putItems(names, numbers, metas)
            if(inven2 === false) {
                return View.LackInvenSpace()
            }

            map.setDumpItems(mapInven)
            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2.inven
            } else {
                inven.inven = inven2.inven
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)
                              .setMap(map.map)

            UserRepository.setUser(userDataDto)
            return View.RetrieveItem(item, number, withItem)
        },
        GetItem : function(bot) {
            let {hash, args} = bot
            let [item, number, store, withItem] = args
            number = Number(number)

            if(notExistUser(hash)) {
                return View.NotSignUp()
            } else if(busyUser(hash)) {
                return View.NowBusy()
            } else if(isNaN(number)) {
                return View.NotNumber()
            } else if(number <= 0) {
                return View.OutOfRangeNumber()
            } else if(store === withItem) {
                return View.CommandError()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            
            let storeInven = withItemInven(store, inven)
            if(typeof storeInven === "string") {
                return View.CantFindStore()
            }

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            let [storeInven2, outItems] = storeInven.getItems([item], [number])
            if(storeInven2 === false) {
                return View.LackInvenItem()
            }

            let [names, numbers, metas] = Inven.splitItemInfo(outItems)
            let inven2 = (withItem ? itemInven : inven).putItems(names, numbers, metas)
            if(inven2 === false) {
                return View.LackInvenSpace()
            }

            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2.inven
            } else {
                inven.inven = inven2.inven
            }
            inven.findItem(store).meta.inven = storeInven2.inven

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)

            UserRepository.setUser(userDataDto)
            return View.GetItem(item, number, store, withItem)
        },
        PutItem : function(bot) {
            let {hash, args} = bot
            let [item, number, store, withItem] = args
            number = Number(number)

            if(notExistUser(hash)) {
                return View.NotSignUp()
            } else if(busyUser(hash)) {
                return View.NowBusy()
            } else if(isNaN(number)) {
                return View.NotNumber()
            } else if(number <= 0) {
                return View.OutOfRangeNumber()
            } else if(store === withItem) {
                return View.CommandError()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            
            let storeInven = withItemInven(store, inven)
            if(typeof storeInven === "string") {
                return View.CantFindStore()
            }

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            let [inven2, outItems] = (withItem ? itemInven : inven).getItems([item], [number])
            if(inven2 === false) {
                return View.LackInvenItem()
            }

            let [names, numbers, metas] = Inven.splitItemInfo(outItems)
            let storeInven2 = storeInven.putItems(names, numbers, metas)
            if(storeInven2 === false) {
                return View.LackInvenSpace()
            }    

            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2.inven
            } else {
                inven.inven = inven2.inven
            }
            inven.findItem(store).meta.inven = storeInven2.inven

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)

            UserRepository.setUser(userDataDto)
            return View.PutItem(item, number, store, withItem)
        },
        CraftItem : function(bot) {
            let {hash, args} = bot
            let [item, number, craftNum] = args
            number = Number(number)

            if(notExistUser(hash)) {
                return View.NotSignUp()
            } else if(busyUser(hash)) {
                return View.NowBusy()
            } else if(isNaN(number)) {
                return View.NotNumber()
            } else if(number <= 0) {
                return View.OutOfRangeNumber()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)
            let craft = new Craft(inven)

            let tier = UserRepository.getBasicInfo(hashDto).tier
            let nameTierDto = new NameTierDto(item, tier)
            let craftNumber = CraftRepository.getCraftNum(nameTierDto)

            if(craftNum) {
                if(isNaN(craftNum)) {
                    return View.NotNumber()
                } else if (craftNumber < craftNum || craftNum <= 0) {
                    return View.OutOfRangeCraftNum()
                }
            } else {
                if (craftNumber > 1) {
                    let craftInfo = []
                    for(let i = 0; i < craftNumber; i++) {
                        craftInfo.push(craft.craftInfo(item, i+1))
                    }

                    let userDataDto = new UserDataDto(hash)
                                    .setMessage(bot.content)

                    UserRepository.setUser(userDataDto)
                    return View.ChooseCraftNum(craftInfo)
                } else {
                    craftNum = 1
                }
            }

            let install = map.getInstall()
            if(install.findItem()) {
                
            }

            let inven2 = craft.craft(item, number, craftNum)
            if(inven2 === "tool") {
                return View.LackInvenTool()
            } else if(inven2 === "inven") {
                return View.LackInvenItem()
            } else if(inven2 === "space") {
                return View.LackInvenSpace()
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven2.inven)

            UserRepository.setUser(userDataDto)
            return View.CraftItem(item, number, withItem)
        },
        BringItem : function(bot) {
            let {hash, args} = bot
            let [item, number, withItem] = args
            number = Number(number)

            if(notExistUser(hash)) {
                return View.NotSignUp()
            } else if(busyUser(hash)) {
                return View.NowBusy()
            } else if(isNaN(number)) {
                return View.NotNumber()
            } else if(number <= 0) {
                return View.OutOfRangeNumber()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            let inven2 = (withItem ? itemInven : inven).putItems([item], [number])
            if(inven2 === false) {
                return View.LackInvenSpace()
            }

            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2.inven
            } else {
                inven.inven = inven2.inven
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)

            UserRepository.setUser(userDataDto)
            return View.BringItem(item, number, withItem)
        }
    }

    module.exports = Presenter
})()