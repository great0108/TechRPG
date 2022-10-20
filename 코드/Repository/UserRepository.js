(function() {
    "use strict"
    const UserDao = require("../Dao/UserDao")
    const IsExistDto = require("../Dto/IsExistDto")
    const InvenDto = require("../Dto/InvenDto")
    const BasicUserDto = require("../Dto/BasicUserDto")

    const UserRepository = {
        isExist : function(hashDto) {
            let result = UserDao.isExist(hashDto.hash)
            return new IsExistDto(result)
        },
        newUser : function(makeUserDto) {
            UserDao.write(makeUserDto.hash, makeUserDto.user)
            UserDao.save()
        },
        getInven : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new InvenDto(user.inven)
        },
        getMap : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new InvenDto(user.map, user.location)
        },
        getBasicInfo : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new BasicUserDto(user.name, user.location, user.busyTime, user.tier)
        },
        setUser : function(userDataDto) {
            let user = UserDao.read(userDataDto.hash)
            let hash = userDataDto.hash
            delete userDataDto.hash
            UserDao.write(hash, Object.assign(user, userDataDto))
            UserDao.save()
        }
    }
    
    module.exports = UserRepository
})()