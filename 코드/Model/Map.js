(function() {
    "use strict"
    const MapMaker = require("./MapMaker")
    const Inven = require("./Inven")

    /**
     * 맵 관련 기능을 하는 모듈
     * @param {object} map 
     * @param {string} location 
     */
    const Map = function(map, location) {
        this.map = map
        this.location = location
    }

    /**
     * 맵 정보 텍스트를 만듬
     * @param {string} location 
     * @returns {string}
     */
    Map.prototype.mapInfo = function(location) {
        let inven = new Inven(this.map[location].items, this.invenSetting)
        let dumpInven = new Inven(this.map[location].dumpItems, this.invenSetting)
        return "아이템\n" + inven.invenInfo() + 
        (this.location === location ? "\n\n" + "버린 아이템\n" + (dumpInven.invenInfo() || "없음") : "")
    }

    /** 맵 인벤 기본 세팅 */
    Map.prototype.invenSetting = {
        canItem : true,
        canLiquid : true,
        includeItem : [],
        excludeItem : [],
        invenLimit : 10000
        // itemStack : 20,
        // liquidStack : 1
    }

    /**
     * 맵에서 특정 바이옴의 닉네임을 만듬
     * @param {string} biomename 
     * @returns {string}
     */
    Map.prototype.makeName = function(biomename) {
        let num = 1
        while(this.isExist(biomename + num)) {
            num++
        }
        return biomename + num
    }

    /**
     * 맵에 특정 이름의 장소가 있는지 확인
     * @param {string} name 
     * @returns {boolean}
     */
    Map.prototype.isExist = function(name) {
        return Boolean(this.map[name])
    }

    /**
     * 맵에서 특정 이름의 장소를 가져옴
     * @param {string} name 
     * @returns {type : string, coord : number[], dumpItems : object[], items : object[], install : object[]}
     */
    Map.prototype.getLocate = function(name) {
        if(!this.map[name]) {
            throw new Error("이런 이름의 장소는 없습니다.")
        }
        return this.map[name]
    }

    /**
     * 맵에 특정 바이옴의 장소를 추가함
     * @param {string} biomename 
     * @param {number[]} coord 
     */
    Map.prototype.putLocate = function(biomename, coord) {
        let name = this.makeName(biomename)
        this.map[nick] = new MapMaker(name, coord)
    }

    /**
     * 현재 장소에 있는 아이템을 수집함
     * @param {string[]} names 
     * @param {number[]} nums 
     * @returns { [object[]|boolean, object[]|undefined] }
     */
    Map.prototype.getItems = function(names, nums) {
        let inven = new Inven(this.map[this.location].items, this.invenSetting)
        return inven.getItems(names, nums)
    }

    /**
     * 현재 장소에 설치된 기구를 가져옴
     * @returns {Inven}
     */
    Map.prototype.getInstall = function() {
        return new Inven(this.map[this.location].install, this.invenSetting)
    }

    /**
     * 현재 장소에 아이템을 버림
     * @param {string[]}
     * @returns {object[]|boolean}
     */
    Map.prototype.dumpItems = function(names, nums, metas) {
        let inven = new Inven(this.map[this.location].dumpItems, this.invenSetting)
        return inven.putItems(names, nums, metas)
    },

    /**
     * 현재 장소에 버려진 아이템을 회수함
     * @param {string[]} names 
     * @param {number[]} nums 
     * @returns { [object[]|boolean, object[]|undefined] }
     */
    Map.prototype.retrieveItems = function(names, nums) {
        let inven = new Inven(this.map[this.location].dumpItems, this.invenSetting)
        return inven.getItems(names, nums)
    }

    /**
     * 특정 이름의 장소에 있는 아이템을 설정함
     * @param {Inven} inven 
     * @param {string|undefined} location 
     */
    Map.prototype.setItems = function(inven, location) {
        this.map[location || this.location].items = inven.inven
    }

    /**
     * 현재 장소에 버려진 아이템을 설정함
     * @param {Inven} inven 
     */
    Map.prototype.setDumpItems = function(inven) {
        this.map[this.location].dumpItems = inven.inven
    }
    
    module.exports = Map
})()