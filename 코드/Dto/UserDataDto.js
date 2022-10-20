(function() {
    "use strict"

    const UserDataDto = function(hash) {
        this.hash = hash
    }
    UserDataDto.prototype.setInven = function(inven) {
        this.inven = inven
        return this
    }
    UserDataDto.prototype.setMap = function(map) {
        this.map = map
        return this
    }
    UserDataDto.prototype.setLocation = function(location) {
        this.location = location
        return this
    }
    UserDataDto.prototype.setBusyTime = function(busyTime) {
        this.busyTime = busyTime
        return this
    }
    UserDataDto.prototype.SetMessageState = function(messageState) {
        this.messageState = messageState
        return this
    }

    
    module.exports = UserDataDto
})()