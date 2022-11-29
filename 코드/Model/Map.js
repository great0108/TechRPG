(function() {
    "use strict"
    const BiomeRepository = require("../Repository/BiomeRepository")
    const MapMaker = require("./MapMaker")
    const Inven = require("./Inven")

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
        let install = this.getInstall()
        return "아이템\n" + inven.invenInfo() + 
        (this.location === location ? "\n\n버린 아이템\n" + (dumpInven.invenInfo() || "없음") : "") + "\n\n" +
        "설치된 기구\n" + (install.invenInfo() || "없음")
    }

    /** 맵 인벤 기본 세팅 */
    Map.prototype.invenSetting = {
        canItem : true,
        canLiquid : true,
        includeItem : [],
        excludeItem : [],
        invenLimit : 10000
    }

    Map.prototype.installSetting = {
        canItem : true,
        canLiquid : false,
        includeItem : [],
        excludeItem : [],
        invenLimit : 10000,
        isInstall : true
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
     * 맵에 특정 좌표의 장소가 있는지 확인
     * @param {number[]} coord 
     * @returns {boolean}
     */
    Map.prototype.isExistCoord = function(coord) {
        return Object.keys(this.map).some(v => this.map[v].coord[0] === coord[0] && this.map[v].coord[1] === coord[1])
    }

    /**
     * 맵에서 특정 이름의 장소를 가져옴
     * @param {string} name 
     * @returns {map}
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
     * @returns { [Inven|boolean, object[]|undefined] }
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
        return new Inven(this.map[this.location].install, this.installSetting)
    }

    /**
     * 현재 장소에 아이템을 버림
     * @param {string[]}
     * @returns {Inven|boolean}
     */
    Map.prototype.dumpItems = function(names, nums, metas) {
        let inven = new Inven(this.map[this.location].dumpItems, this.invenSetting)
        return inven.putItems(names, nums, metas)
    },

    /**
     * 현재 장소에 버려진 아이템을 회수함
     * @param {string[]} names 
     * @param {number[]} nums 
     * @returns { [Inven|boolean, object[]|undefined] }
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

    /**
     * 현재 장소에 설치된 기구를 설정함
     * @param {Inven} inven 
     */
    Map.prototype.setInstall = function(inven) {
        this.map[this.location].install = inven.inven
    }

    /**
     * 두 좌표간의 거리를 계산함
     * @param {number[]} c1 
     * @param {number[]} c2 
     * @returns {number}
     */
    Map.prototype.distance = function(c1, c2) {
        return Math.pow((c1[0] - c2[0]), 2) + Math.pow((c1[1] - c2[1]), 2)
    }

    /**
     * 특정 좌표 근처 장소들을 가져옴
     * @param {number[]} coord 
     * @returns {map[]}
     */
    Map.prototype.nearPlace = function(coord) {
        let result = []
        for(let name in this.map) {
            let c = this.map[name].coord
            if(this.distance(coord, c) == 1) {
                result.push(this.map[name])
            }
        }
        return result
    }

    /**
     * 시작 좌표에서 마지막 좌표로 움직일 때 지나가는 좌표들을 계산함
     * @param {number[]} start 
     * @param {number[]} end 
     * @returns {number[][]}
     */
    Map.prototype.moveWay = function(start, end) {
        if(start[0] === end[0]) {
            return Array( Math.abs(start[1] - end[1])+1 ).fill()
            .map((v, i) => [start[0], start[1]+(start[1] < end[1] ? i : -i)])
        }

        let isReverse = false
        if(start[0] > end[0]) {
            let temp = start
            start = end
            end = temp
            isReverse = true
        }

        let dx = end[0] - start[0]
        let dy = end[1] - start[1]
        let ratio = dy/dx
        let result = []
        let lastY = 0

        for(let i = 0; i <= dx; i++) {
            let y = Math.round(ratio * Math.min((i+0.5), dx))
            for(let j = lastY; dy > 0 ? j <= y : j >= y; dy > 0 ? j++ : j--) {
                result.push([start[0]+i, start[1]+j])
            }
            lastY = y
        }
        return isReverse ? result.reverse() : result
    }

    /**
     * 특정 좌표의 바이옴을 만듦
     * @param {number[]} coord 
     * @returns {string}
     */
    Map.prototype.makeBiome = function(coord) {
        let near = this.nearPlace(coord)
        let random = Math.random() * 2.5
        if(random < near.length) {
            let biomes = near.map(v => v.type)
            return biomes[Math.random() * biomes.length | 0]
        } else {
            let biomes = BiomeRepository.getBiomeList()
            return biomes[Math.random() * biomes.length | 0]
        }
    }

    /**
     * 특정 좌표까지 탐험함
     * @param {number[]} coord 
     * @returns {number}
     */
    Map.prototype.explore = function(coord) {
        let coords = this.moveWay(this.location, coord)
        let count = 0
        for(let coord of coords) {
            if(this.isExistCoord(coord)) {
                continue
            }
            let biome = this.makeBiome(coord)
            this.putLocate(biome, coord)
            count++
        }
        return count
    }
    
    module.exports = Map
})()