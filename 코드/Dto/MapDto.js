(function() {
    "use strict"

    /**
     * 맵 객체
     * @typedef {object} map
     * @property {string} type
     * @property {number[]} coord
     * @property {object[]} items
     * @property {object[]} dumpItems
     * @property {object[]} install
     */

    /**
     * 맵 정보를 담는 Dto 클래스
     * @param {object<string : map>} map 
     * @param {string} location 
     */
    const MapDto = function(map, location) {
        this.map = map
        this.location = location
    }
    
    module.exports = MapDto
})()