(function() {
    "use strict"

    const BasicUserDto = function(name, location, busyTime, tier) {
        this.name = name
        this.location = location
        this.busyTime = busyTime
        this.tier = tier
    }
    
    module.exports = BasicUserDto
})()