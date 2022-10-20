(function() {
    "use strict"
    const MapMaker = require("./MapMaker")
    const Inven = require("./Inven")

    const Map = function(map, location) {
        this.map = map
        this.location = location
    }
    Map.prototype.mapInfo = function() {
        return ""
    }
    Map.prototype.InvenSetting = {
        canItem : true,
        canLiquid : true,
        includeItem : [],
        excludeItem : [],
        invenLimit : 10000
        // itemStack : 20,
        // liquidStack : 1
    }
    Map.prototype.makeName = function(biomename) {
        let num = 1
        while(this.isExist(biomename + num)) {
            num++
        }
        return biomename + num
    }
    Map.prototype.isExist = function(name) {
        return Boolean(this.map[name])
    }
    Map.prototype.getLocate = function(name) {
        let locate = Object.keys(this.map).filter(v => this.map[v].name === name)
        if(locate.length === 0) ErrorHandler.throw("이런 바이옴의 장소는 없습니다.")
        return locate
    }
    Map.prototype.putLocate = function(biomename, coord) {
        let name = this.makeName(biomename)
        this.map[nick] = new LocateMaker(name, coord)
    }
    Map.prototype.getItems = function(names, nums) {

    }
    Map.prototype.dumpItems = function(names, nums, metas) {

    }
    
    module.exports = Map
})()