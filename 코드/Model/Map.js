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
    
    Map.prototype.explore = function(coord) {

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
    
    module.exports = Map
})()

// let mapType = [1,2,3,4,5,6,7,8,9]

// Map = function() {
//     this.map = {}
// }
// Map.prototype.make = function(type, coord) {
//     let name = this.name(type)
//     this.map[name] = {coord : coord, type : type}
// }
// Map.prototype.name = function(type) {
//     let i = 1
//     while(this.map[String(type) + i]) {
//         i++
//     }
//     return String(type) + i
// }
// Map.prototype.nearPlace = function(coord) {
//     let result = []
//     for(let name in this.map) {
//         let c = this.map[name].coord
//         if(this.distance(coord, c) == 1) {
//         result.push(this.map[name])
//         }
//     }
//     return result
// }
// Map.prototype.distance = function(c1, c2) {
//     return Math.pow((c1[0] - c2[0]), 2) + Math.pow((c1[1] - c2[1]), 2)
// }
// Map.prototype.moveWay = function(start, end) {
//     if(start[0] === end[0]) {
//       return Array( Math.abs(start[1] - end[1])+1 ).fill()
//             .map((v, i) => [start[0], start[1]+(start[1] < end[1] ? i : -i)])
//     }
//     let isReverse = false
//     if(start[0] > end[0]) {
//       let temp = start
//       start = end
//       end = temp
//       isReverse = true
//     }
//     let dx = end[0] - start[0]
//     let dy = end[1] - start[1]
//     let ratio = dy/dx
//     let result = []
//     let lastY = 0
//     for(let i = 0; i <= dx; i++) {
//       let y = Math.round(ratio * Math.min((i+0.5), dx))
//       for(let j = lastY; dy > 0 ? j <= y : j >= y; dy > 0 ? j++ : j--) {
//         result.push([start[0]+i, start[1]+j])
//       }
//       lastY = y
//     }
//     return isReverse ? result.reverse() : result
// }
// Map.prototype.random = function() {
//     return mapType[Math.random() * mapType.length | 0]
// }
// Map.prototype.selectType = function(coord) {
//     let near = this.nearPlace(coord)
//     let random = Math.random() * 2 | 0
//     if(random < near.length) {
//         return near[random].type
//     } else {
//         return this.random()
//     }
// }
// Map.prototype.isExistCoord = function(coord) {
//     return Object.keys(this.map).some(v => this.map[v].coord[0] === coord[0] && this.map[v].coord[1] === coord[1])
// }
// Map.prototype.explore = function(start, end) {
//     let coords = this.moveWay(start, end)
//     for(let coord of coords) {
//         if(this.isExistCoord(coord)) {
//             continue
//         }
//         let type = this.selectType(coord)
//         this.make(type, coord)
//     }
// }