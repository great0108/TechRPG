(function() {
    "use strict"
    const User = require("../Model/User")
    const UserDao = require("../Dao/UserDao")
    const IsExistDto = require("../Dto/IsExistDto")
    const MyInfoDto = require("../Dto/MyInfoDto")
    const InvenDto = require("../Dto/InvenDto")

    const UserRepository = {
        isExist : function(hashDto) {
            let result = UserDao.isExist(hashDto.hash)
            return new IsExistDto(result)
        },
        newUser : function(senderDto) {
            let user = new User(senderDto.sender)
            UserDao.write(senderDto.hash, user)
            UserDao.save()
        },
        getMyInfo : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new MyInfoDto(user.name, user.location, user.busy)
        },
        getInven : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new InvenDto(user.inven)
        },
        getMap : function(hashDto) {

        }
    }
    module.exports = UserRepository
})()