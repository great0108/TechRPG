(function() {
    "use strict"
    const UserRepository = require("../Repository/UserRepository")
    const HashDto = require("../Dto/HashDto")

    const UserHandler = function(hash) {
        let hashDto = new HashDto(hash)
        let isExistDto = UserRepository.isExist(hashDto)
        if(isExistDto.isExist) {
            let userDto = UserRepository.getUser(hashDto)
            this.user = userDto.user
        } else {
            this.user = null
        }
    }
    UserHandler.prototype.isExist = function() {
        return this.user === null
    }

    module.exports = UserHandler
})