(function() {
    "use strict"
    const Inven = require("../Model/Inven")
    const Map = require("../Model/Map")
    const UserMaker = require("../Model/UserMaker")
    const Err = require("../Util/Err")
    const UserRepository = require("../Repository/UserRepository")
    const HashDto = require("../Dto/HashDto")
    const MakeUserDto = require("../Dto/MakeUserDto")

    const User = function(hash) {
        this.hash = hash
        this.hashDto = new HashDto(hash)
    }
    User.prototype.isExist = function() {
        return UserRepository.isExist(this.hashDto)
    }
    User.prototype.isBusy = function() {
        return this.getBasicInfo().busyTime >= Date.now()
    }
    User.prototype.makeUser = function(name) {
        let user = new UserMaker(name)
        let makeUserDto = new MakeUserDto(this.hash, user)
        UserRepository.newUser(makeUserDto)
    }
    User.prototype.getBasicInfo = function() {
        return UserRepository.getBasicInfo(this.hashDto)
    }
    User.prototype.getMessage = function() {
        return UserRepository.getMessage(this.hashDto)
    }
    User.prototype.getInven = function() {
        let invenDto = UserRepository.getInven(this.hashDto)
        return new Inven(invenDto.inven)
    }
    User.prototype.getMap = function() {
        let mapDto = UserRepository.getMap(this.hashDto)
        return new Map(mapDto.map, mapDto.location)
    }
    User.prototype.setUser = function(userData) {
        userData.hash = this.hash
        UserRepository.setUser(userData)
    }
    User.prototype.errorCheck = function(number) {
        if(!user.isExist()) {
            Err.NotSignUp()
        } else if(user.getMessage()) {
            user.setUser(new UserData.setMessage(null))
            Err.CancleCommand()
        } else if(user.isBusy()) {
            Err.NowBusy()
        } else if(isNaN(number)) {
            Err.NotNumber()
        } else if(number <= 0) {
            Err.OutOfRangeNumber()
        }
    }

    module.exports = User
})()