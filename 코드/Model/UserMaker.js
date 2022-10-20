(function() {
    "use strict"
    const MapMaker = require("./MapMaker")

    const UserMaker = function(name) {
        this.name = name
        this.inven = []
        this.location = "base"
        this.map = {"base" : new MapMaker("base", [0,0])}
        this.busyTime = Date.now()
        this.messageState = null
        this.tier = 0
    }
    
    module.exports = UserMaker
})()