(function() {
    "use strict"
    const MapMaker = require("./MapMaker")

    const UserMaker = function(name) {
        this.name = name
        this.inven = []
        this.location = "base"
        let base = new MapMaker("base", [0,0])
        this.map = {"base" : base}
        this.busyTime = Date.now()
        this.tier = 0
    }
    
    module.exports = UserMaker
})()