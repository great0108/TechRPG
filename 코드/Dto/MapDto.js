(function() {
    "use strict"

    /**
     * 맵 정보를 담는 Dto 클래스
     * @param {object< string : {type : string, coord : number[], dumpItems : object[], items : object[], install : object[]} >} map 
     * @param {string} location 
     */
    const MapDto = function(map, location) {
        this.map = map
        this.location = location
    }
    
    module.exports = MapDto
})()