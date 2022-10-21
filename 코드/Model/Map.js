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
        if(!this.map[name]) {
            throw new Error("이런 이름의 장소는 없습니다.")
        }
        return this.map[name]
    }
    Map.prototype.putLocate = function(biomename, coord) {
        let name = this.makeName(biomename)
        this.map[nick] = new MapMaker(name, coord)
    }
    Map.prototype.getItems = function(names, nums) {
        let inven = new Inven(this.map[this.location].items)
        return inven.getItems(names, nums)
    }
    Map.prototype.dumpItems = function(names, nums, metas) {
        let inven = new Inven(this.map[this.location].dumpItems)
        return inven.putItems(names, nums, metas)
    },
    Map.prototype.retrieveItems = function(names, nums) {
        let inven = new Inven(this.map[this.location].dumpItems)
        return inven.getItems(names, nums)
    }
    Map.prototype.setItems = function(items) {
        this.map[this.location].items = items
    }
    Map.prototype.setDumpItems = function(items) {
        this.map[this.location].dumpItems = items
    }

    
    module.exports = Map
})()