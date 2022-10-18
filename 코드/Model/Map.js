(function() {
    "use strict"

    const Map = function(map, location) {
        this.map = map
        this.location = location
    }
    Map.prototype.mapInfo = function() {
        return ""
    }
    
    module.exports = Map
})()