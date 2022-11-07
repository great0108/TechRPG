(function() {
    "use strict"
    const MapMaker = require("./MapMaker")
    const Inven = require("./Inven")

    const Map = function(map, location) {
        this.map = map
        this.location = location
    }
    Map.prototype.mapInfo = function(location) {
        let inven = new Inven(this.map[location].items, this.invenSetting)
        let dumpInven = new Inven(this.map[location].dumpItems, this.invenSetting)
        return "아이템\n" + inven.invenInfo() + 
        (this.location === location ? "\n\n" + "버린 아이템\n" + (dumpInven.invenInfo() || "없음") : "")
    }
    Map.prototype.invenSetting = {
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
        let inven = new Inven(this.map[this.location].items, this.invenSetting)
        return inven.getItems(names, nums)
    }
    Map.prototype.getInstall = function() {
        return new Inven(this.map[this.location].install, this.invenSetting)
    }
    Map.prototype.dumpItems = function(names, nums, metas) {
        let inven = new Inven(this.map[this.location].dumpItems, this.invenSetting)
        return inven.putItems(names, nums, metas)
    },
    Map.prototype.retrieveItems = function(names, nums) {
        let inven = new Inven(this.map[this.location].dumpItems, this.invenSetting)
        return inven.getItems(names, nums)
    }
    Map.prototype.setItems = function(inven, location) {
        this.map[location || this.location].items = inven.inven
    }
    Map.prototype.setDumpItems = function(inven) {
        this.map[this.location].dumpItems = inven.inven
    }
    
    module.exports = Map
})()