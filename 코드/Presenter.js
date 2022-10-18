(function() {
    "use strict"
    const View = require("./View")
    const UserMaker = require("./Model/UserMaker")
    const Inven = require("./Model/Inven")
    const Map = require("./Model/Map")
    const UserRepository = require("./Repository/UserRepository")
    const HashDto = require("./Dto/HashDto")
    const MakeUserDto = require("./Dto/MakeUserDto")

    const notExistUser = function(hash) {
        let hashDto = new HashDto(hash)
        let isExistDto = UserRepository.isExist(hashDto)
        return isExistDto.isExist
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
            let myInfoDto = UserRepository.getMyInfo(hashDto)
            return View.MyInfo(myInfoDto.name, myInfoDto.location, myInfoDto.busy)
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

        },
        RetrieveItem : function(msg, sender, hash) {

        },
        DumpItem : function(msg, sender, hash) {

        }
    }

    module.exports = Presenter
})()