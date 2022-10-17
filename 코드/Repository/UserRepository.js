(function() {
    "use strict"
    const UserDao = require("../Dao/UserDao")
    const IsExistDto = require("../Dto/IsExistDto")
    const User = require("../Model/User")

    const UserRepository = {
        isExist : function(hashDto) {
            let result = UserDao.isExist(hashDto.hash)
            return new IsExistDto(result)
        },
        newUser : function(senderDto) {
            let user = new User(senderDto.sender)
            UserDao.write(senderDto.hash, user)
            UserDao.save()
        }
    }
    module.exports = UserRepository
})()