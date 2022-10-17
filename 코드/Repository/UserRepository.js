(function() {
    "use strict"
    const User = require("../Model/User")
    const UserDao = require("../Dao/UserDao")
    const IsExistDto = require("../Dto/IsExistDto")
    const UserDto = require("../Dto/UserDto")

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
        getUser : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new UserDto(user)
        }
    }
    module.exports = UserRepository
})()