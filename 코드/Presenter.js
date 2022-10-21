(function() {
    "use strict"
    const View = require("./View")
    const UserMaker = require("./Model/UserMaker")
    const Inven = require("./Model/Inven")
    const Map = require("./Model/Map")
    const UserRepository = require("./Repository/UserRepository")
    const ItemRepository = require("./Repository/ItemRepository")
    const HashDto = require("./Dto/HashDto")
    const NameDto = require("./Dto/NameDto")
    const MakeUserDto = require("./Dto/MakeUserDto")
    const UserDataDto = require("./Dto/UserDataDto")

    const notExistUser = function(hash) {
        let hashDto = new HashDto(hash)
        let isExistDto = UserRepository.isExist(hashDto)
        return !isExistDto.isExist
    }

    const withItemInven = function(withItem, inven) {
        let nameDto2 = new NameDto(withItem)
        if(!ItemRepository.isExist(nameDto2)) {
            return View.NotExistItem()
        }
        if(!inven.isExist(withItem)) {
            return View.NotHaveItem()
        }
        let setting = ItemRepository.getInvenInfo(nameDto2)
        return new Inven(inven.findItem(withItem).meta.inven, setting)
    }

    const checkItemAndNumber = function(item, number, tier) {
        let nameDto = new NameDto(item)
        if(!ItemRepository.isExist(nameDto)) {
            return View.NotExistItem()
        }
        if(isNaN(number)) {
            return View.NotNumber()
        }
        if(number <= 0 || number > tier * 10 + 10) {
            return View.NotRangeNumber()
        }
        return false
    }

    const Presenter = {
        SignUp : function(msg, sender, hash) {
            if(!notExistUser(hash)) {
                return View.AlreadySignUp()
            }

            let user = new UserMaker(sender)
            let makeUserDto = new MakeUserDto(hash, user)
            UserRepository.newUser(makeUserDto)
            return View.SignUp()
        },
        Command : function(msg, sender, hash) {
            return View.Command()
        },
        MyInfo : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }

            let hashDto = new HashDto(hash)
            let basicUserDto = UserRepository.getBasicInfo(hashDto)
            return View.MyInfo(basicUserDto.name, basicUserDto.location, basicUserDto.busyTime > Date.now(), basicUserDto.tier)
        },
        InvenInfo : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            return View.InvenInfo(inven.invenInfo(), inven.invenLimit, inven.invenSpace())
        },
        MapInfo : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }

            let hashDto = new HashDto(hash)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)
            return View.MapInfo(map.mapInfo())
        },
        CollectItem : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }
            let hashDto = new HashDto(hash)
            let user = UserRepository.getBasicInfo(hashDto)
            if(user.busyTime >= Date.now()) {
                return View.NowBusy()
            }

            msg = msg.split(" ")
            let item = msg[0]
            let number = Number(msg[1])
            let withItem = msg[2]

            let result = checkItemAndNumber(item, number, user.tier)
            if(result) {
                return result
            }

            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            let [mapInven, _] = map.getItems([item], [number])
            if(mapInven === false) {
                return View.LackMapItem()
            }
            
            let nameDto = new NameDto(item)
            let collectItemDto = ItemRepository.getCollectInfo(nameDto)
            let tools = inven.findTool(collectItemDto.effective)
            let i = 0
            while(tools && tools.length > i) {
                if(tools[i].meta.tier < collectItemDto.tier) {
                    break
                }
                if(tools[i].meta.durability >= number) {
                    tool = tools[i]
                    break
                }
            }
            if(!tool && collectItemDto.tier >= 1) {
                return View.CantCollectItem()
            }
            
            let time = collectItemDto.collectTime * number / (tool ? tool.meta.speed : 1)
            let inven2 = null
            if(!tool) {
                inven2 = (withItem ? itemInven : inven).putItems([item], [number])
            } else if(tool.meta.durability === number) {
                let [tempInven, _] = inven.getItems([tool.nick], [1])
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
                inven.findItem(withItem).meta.inven = inven2
            } else {
                inven.inven = inven2
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)
                              .setMap(map.map)
                              .setBusyTime(Date.now() + time*1000)

            UserRepository.setUser(userDataDto)
            return View.CollectItem(item, number, time, tool, withItem)

        },
        DumpItem : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }
            let hashDto = new HashDto(hash)
            let user = UserRepository.getBasicInfo(hashDto)
            if(user.busyTime >= Date.now()) {
                return View.NowBusy()
            }

            msg = msg.split(" ")
            let item = msg[0]
            let number = Number(msg[1])
            let withItem = msg[2]

            let result = checkItemAndNumber(item, number, user.tier)
            if(result) {
                return result
            }

            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)

            let itemInven = withItem ? withItemInven(withItem, inven) : null
            if(typeof itemInven === "string") {
                return itemInven
            }

            [inven2, outItems] = (withItem ? itemInven : inven).getItems([item], [number])
            if(inven2 === false) {
                return View.LackInvenItem()
            }

            let [names, numbers, metas] = Inven.splitItemInfo(outItems)
            let dumpItems = map.dumpItems(names, numbers, metas)
            map.setDumpItems(dumpItems)

            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2
            } else {
                inven.inven = inven2
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)
                              .setMap(map.map)

            UserRepository.setUser(userDataDto)
            return View.DumpItem(item, number, withItem)

        },
        RetrieveItem : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }
            let hashDto = new HashDto(hash)
            let user = UserRepository.getBasicInfo(hashDto)
            if(user.busyTime >= Date.now()) {
                return View.NowBusy()
            }

            msg = msg.split(" ")
            let item = msg[0]
            let number = Number(msg[1])
            let withItem = msg[2]

            let result = checkItemAndNumber(item, number, user.tier)
            if(result) {
                return result
            }

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
            [inven2, _] = (withItem ? itemInven : inven).putItems(names, numbers, metas)
            if(inven2 === false) {
                return View.LackInvenSpace()
            }

            map.setDumpItems(mapInven)
            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2
            } else {
                inven.inven = inven2
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)
                              .setMap(map.map)

            UserRepository.setUser(userDataDto)
            return View.retrieveItem(item, number, withItem)
        },
        GetItem : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }
            let hashDto = new HashDto(hash)
            let user = UserRepository.getBasicInfo(hashDto)
            if(user.busyTime >= Date.now()) {
                return View.NowBusy()
            }

            msg = msg.split(" ")
            let item = msg[0]
            let number = Number(msg[1])
            let store = msg[2]
            let withItem = msg[3]

            let result = checkItemAndNumber(item, number, user.tier)
            if(result) {
                return result
            }

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

            [storeInven2, outItems] = storeInven.getItems([item], [number])
            if(storeInven2 === false) {
                return View.LackInvenItem()
            }

            let [names, numbers, metas] = Inven.splitItemInfo(outItems)
            [inven2, _] = (withItem ? itemInven : inven).putItems(names, numbers, metas)
            if(inven2 === false) {
                return View.LackInvenSpace()
            }

            inven.findItem(store).meta.inven = storeInven2
            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2
            } else {
                inven.inven = inven2
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)

            UserRepository.setUser(userDataDto)
            return View.GetItem(item, number, store, withItem)
        },
        PutItem : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }
            let hashDto = new HashDto(hash)
            let user = UserRepository.getBasicInfo(hashDto)
            if(user.busyTime >= Date.now()) {
                return View.NowBusy()
            }

            msg = msg.split(" ")
            let item = msg[0]
            let number = Number(msg[1])
            let store = msg[2]
            let withItem = msg[3]

            let result = checkItemAndNumber(item, number, user.tier)
            if(result) {
                return result
            }

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

            [inven2, outItems] = (withItem ? itemInven : inven).getItems([item], [number])
            if(inven2 === false) {
                return View.LackInvenItem()
            }

            let [names, numbers, metas] = Inven.splitItemInfo(outItems)
            [storeInven2, _] = storeInven.putItems(names, numbers, metas)
            if(storeInven2 === false) {
                return View.LackInvenSpace()
            }    

            inven.findItem(store).meta.inven = storeInven2
            if(withItem) {
                inven.findItem(withItem).meta.inven = inven2
            } else {
                inven.inven = inven2
            }

            let userDataDto = new UserDataDto(hash)
                              .setInven(inven.inven)

            UserRepository.setUser(userDataDto)
            return View.PutItem(item, number, store, withItem)
        }
    }

    module.exports = Presenter
})()