(function() {
    "use strict"

    const MapMaker = function(type, coord, items) {
        this.type = type
        this.coord = coord
        this.dumpItems = []
        this.items = items
    }

    module.exports = MapMaker
})