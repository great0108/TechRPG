(function() {
    "use strict"

    const UserMaker = function(name) {
        this.name = name
        this.inven = []
        this.location = "base"
        this.map = {"base":{"type":"base","coord":[0,0]}}
        this.busy = false
        this.busyTime = Date.now()
        this.messageState = null
    }
    
    module.exports = UserMaker
})()