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

    const busyUser = function(hash) {
        let hashDto = new HashDto(hash)
        let user = UserRepository.getUser(hashDto).user
        return user.busyTime >= Date.now()
    }

    const Presenter = {
        SignUp : function(msg, sender, hash) {
            if(notExistUser(hash)) {
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
            let userDto = UserRepository.getUser(hashDto)
            return View.MyInfo(userDto.name, userDto.location, userDto.busy)
        },
        InvenInfo : function(msg, sender, hash) {
            if(notExistUser(hash)) {
                return View.NotSignUp()
            }

            let hashDto = new HashDto(hash)
            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            return View.invenInfo(inven.itemInfo(), inven.invenLimit, inven.invenSpace())
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
            if(busyUser(hash)) {
                return View.NowBusy()
            }

            msg = msg.split(" ")
            let item = msg[0]
            let number = Number(msg[1])
            let withItem = msg[2]

            let nameDto = new NameDto(item)
            if(!ItemRepository.isExist(nameDto)) {
                return View.NotExistItem()
            }
            if(isNaN(number)) {
                return View.NotNumber()
            }

            let invenDto = UserRepository.getInven(hashDto)
            let inven = new Inven(invenDto.inven)
            let mapDto = UserRepository.getMap(hashDto)
            let map = new Map(mapDto.map, mapDto.location)

            if(withItem) {
                let nameDto2 = new NameDto(withItem)
                if(!ItemRepository.isExist(nameDto2)) {
                    return View.NotExistItem()
                }
                if(!inven.isExist(withItem)) {
                    return View.NotHaveItem()
                }
                let setting = ItemRepository.getInvenInfo(nameDto2)
                itemInven = new Inven(inven.findItem(withItem).inven, setting)
            }

            let mapInven = map.getItems([item], [number])
            if(mapInven === false) {
                return View.LackMapItem()
            }
            
            let collectItemDto = ItemRepository.getCollectInfo(nameDto)
            let tools = inven.filter(v => v.type === collectItemDto.effective).sort((a, b) => b.tier - a.tier)
            let i = 0
            while(tools.length > i) {
                if(tools[i].tier < collectItemDto.tier) {
                    break
                }
                if(tools[i].durability >= number) {
                    tool = tools[i]
                    break
                }
            }
            if(!tool && collectItemDto.tier >= 1) {
                return View.CantCollectItem()
            }
            
            let time = collectItemDto.collectTime * number / (tool ? tool.speed : 1)
            let inven2 = null
            if(!tool) {
                inven2 = (withItem ? itemInven : inven).putItems([item], [number])
            } else if(tool.durability === number) {
                let tempInven = inven.getItems([tool.nick], [1])
                inven2 = (withItem ? itemInven : tempInven).putItems([item], [number])
            } else {
                inven.findItem(tool.nick).durability -= number
                inven2 = (withItem ? itemInven : inven).putItems([item], [number])
            }

            if(inven2 === false) {
                return View.LackInvenSpace()
            }

            map.setItems(mapInven)
            if(withItem) {
                inven.findItem(withItem).inven = inven2
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
            if(busyUser(hash)) {
                return View.NowBusy()
            }

            

        },
        RetrieveItem : function(msg, sender, hash) {

        },
    }

    module.exports = Presenter
})()