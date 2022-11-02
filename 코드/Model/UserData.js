(function() {
    "use strict"

    const UserDataDto = function() {
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
    UserDataDto.prototype.setTier = function(tier) {
        this.tier = tier
        return this
    }
    UserDataDto.prototype.setMessage = function(message) {
        this.message = message
        return this
    }

    
    module.exports = UserDataDto
})()