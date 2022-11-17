(function() {
    "use strict"
    const Inven = require("./Inven")
    const Map = require("./Map")
    const UserMaker = require("./UserMaker")
    const UserData = require("./UserData")
    const Err = require("../Util/Err")
    const UserRepository = require("../Repository/UserRepository")
    const HashDto = require("../Dto/HashDto")
    const MakeUserDto = require("../Dto/MakeUserDto")

    /**
     * 유저 관련 기능을 하는 모듈
     * @param {number} hash 
     */
    const User = function(hash) {
        this.hash = hash
        this.hashDto = new HashDto(hash)
    }

    /**
     * 유저가 있는지 확인
     * @returns {boolean}
     */
    User.prototype.isExist = function() {
        return UserRepository.isExist(this.hashDto).isExist
    }

    /**
     * 유저가 바쁜지 확인
     * @returns {boolean}
     */
    User.prototype.isBusy = function() {
        return this.getBasicInfo().busyTime >= Date.now()
    }

    /**
     * 새로운 유저를 만듦
     * @param {string} name 
     */
    User.prototype.makeUser = function(name) {
        let user = new UserMaker(name)
        let makeUserDto = new MakeUserDto(this.hash, user)
        UserRepository.newUser(makeUserDto)
    }

    /**
     * 기본적인 유저 정보를 가져옴
     * @returns {BasicUserDto}
     */
    User.prototype.getBasicInfo = function() {
        return UserRepository.getBasicInfo(this.hashDto)
    }

    /**
     * 유저 메시지를 가져옴
     * @returns {string|null}
     */
    User.prototype.getMessage = function() {
        return UserRepository.getMessage(this.hashDto).message
    }

    /**
     * 유저 인벤을 만들고 반환함
     * @returns {Inven}
     */
    User.prototype.getInven = function() {
        let invenDto = UserRepository.getInven(this.hashDto)
        return new Inven(invenDto.inven)
    }

    /**
     * 유저 맵을 만들고 반환함
     * @returns {Map}
     */
    User.prototype.getMap = function() {
        let mapDto = UserRepository.getMap(this.hashDto)
        return new Map(mapDto.map, mapDto.location)
    }

    /**
     * 유저 데이터를 설정함
     * @param {UserData} userData 
     */
    User.prototype.setUser = function(userData) {
        userData.hash = this.hash
        UserRepository.setUser(userData)
    }

    /**
     * 기본적인 유저 확인을 함
     */
    User.prototype.basicCheck = function() {
        if(!this.isExist()) {
            Err.NotSignUp()
        } else if(this.getMessage()) {
            this.setUser(new UserData().setMessage(null))
            Err.CancleCommand()
        }
    }

    /**
     * 명령어를 실행할 수 있는지 확인함
     * @param {number} number 
     */
    User.prototype.errorCheck = function(number) {
        this.basicCheck()
        if(this.isBusy()) {
            Err.NowBusy()
        } else if(isNaN(number)) {
            Err.NotNumber()
        } else if(number <= 0) {
            Err.OutOfRangeNumber()
        }
    }

    module.exports = User
})()