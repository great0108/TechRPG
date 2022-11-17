(function() {
    "use strict"
    const UserDao = require("../Dao/UserDao")
    const IsExistDto = require("../Dto/IsExistDto")
    const InvenDto = require("../Dto/InvenDto")
    const MapDto = require("../Dto/MapDto")
    const BasicUserDto = require("../Dto/BasicUserDto")
    const MessageDto = require("../Dto/MessageDto")

    /** 유저 Repository 클래스 */
    const UserRepository = {
        /**
         * 유저가 있는지 확인
         * @param {HashDto} hashDto 
         * @returns {IsExistDto}
         */
        isExist : function(hashDto) {
            let result = UserDao.isExist(hashDto.hash)
            return new IsExistDto(result)
        },

        /**
         * 새로운 유저를 만듦
         * @param {MakeUserDto} makeUserDto 
         */
        newUser : function(makeUserDto) {
            UserDao.write(makeUserDto.hash, makeUserDto.user)
            UserDao.save()
        },

        /**
         * 유저 인벤을 가져옴
         * @param {HashDto} hashDto 
         * @returns {InvenDto}
         */
        getInven : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new InvenDto(user.inven)
        },

        /**
         * 유저 맵을 가져옴
         * @param {HashDto} hashDto 
         * @returns {InvenDto}
         */
        getMap : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new MapDto(user.map, user.location)
        },

        /**
         * 기본적인 유저 정보를 가져옴
         * @param {HashDto} hashDto 
         * @returns {BasicUserDto}
         */
        getBasicInfo : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new BasicUserDto(user.name, user.location, user.busyTime, user.tier)
        },

        /**
         * 유저 데이터를 설정함
         * @param {UserData} userData
         */
        setUser : function(userData) {
            let user = UserDao.read(userData.hash)
            let hash = userData.hash
            delete userData.hash
            UserDao.write(hash, Object.assign(user, userData))
            UserDao.save()
        },

        /**
         * 유저 메시지를 가져옴
         * @param {HashDto} hashDto 
         * @returns {MessageDto}
         */
        getMessage : function(hashDto) {
            let user = UserDao.read(hashDto.hash)
            return new MessageDto(user.message)
        }
    }
    
    module.exports = UserRepository
})()