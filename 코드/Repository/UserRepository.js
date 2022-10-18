(function() {
    "use strict"
    const UserDao = require("../Dao/UserDao")
    const IsExistDto = require("../Dto/IsExistDto")
    const MyInfoDto = require("../Dto/MyInfoDto")
    const InvenDto = require("../Dto/InvenDto")

    const UserRepository = {
        isExist : function(hashDto) {
            let result = UserDao.isExist(hashDto.hash)
            return new IsExistDto(result)
        },
        newUser : function(makeUserDto) {
            UserDao.write(makeUserDto.hash, makeUserDto.user)
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
            let user = UserDao.read(hashDto.hash)
            return new InvenDto(user.map, user.location)
        }
    }
    
    module.exports = UserRepository
})()