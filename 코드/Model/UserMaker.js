(function() {
    "use strict"
    const MapMaker = require("./MapMaker")
    const Setting = require("../Setting")

    /**
     * 새로운 유저를 만드는 모듈
     * @param {string} name 
     */
    const UserMaker = function(name) {
        this.name = name
        this.inven = []
        this.location = "base"
        let base = new MapMaker("평원", [0,0])
        this.map = {"base" : base}
        this.busyTime = Date.now()
        this.tier = 0
        this.message = null
        this.version = Setting.version
    }
    
    module.exports = UserMaker
})()