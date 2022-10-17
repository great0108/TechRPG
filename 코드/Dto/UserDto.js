(function() {
    "use strict"

    const UserDto = function(user) {
        this.name = user.name
        this.inven = user.inven
        this.location = user.location
        this.map = user.map
        this.busy = user.busy
        this.busyTime = user.busyTime
        this.messageState = user.messageState
    }
    module.exports = UserDto
})()