(function() {
    "use strict"
    const BiomeRepository = require("../Repository/BiomeRepository")
    const NameDto = require("../Dto/NameDto")
    const ItemMaker = require("./ItemMaker")

    /**
     * 맵에 들어갈 장소를 만드는 모듈
     * @param {string} type 
     * @param {number[]} coord 
     */
    const MapMaker = function(type, coord) {
        this.type = type
        this.coord = coord
        this.dumpItems = []

        let nameDto = new NameDto(type)
        let BiomeItemDto = BiomeRepository.getItem(nameDto)
        this.items = this.makeItems(BiomeItemDto.items)
        this.install = []
    }

    /**
     * 장소에 들어갈 아이템을 만듦
     * @param {object< string : {number : number, exist : number|undefined, bothExist : number|undefined} >} items 
     * @returns {object[]}
     */
    MapMaker.prototype.makeItems = function(items) {
        let inven = []
        for(let name in items) {
            let range = items[name].number
            let number = this.random(range[0], range[1])
            if(items[name].exist) {
                if(Math.random() > items[name].exist) {
                    continue
                }
            }
            if(items[name].bothExist) {
                if(!inven.some(v => v.name === items[name].bothExist)) {
                    continue
                }
            }
            inven.push(new ItemMaker(name, number))
        }
        return inven
    }

    /**
     * 최소 이상 최대 이하의 랜덤한 값을 반환함
     * @param {number} start 
     * @param {number} end 
     * @returns {number}
     */
    MapMaker.prototype.random = function(start, end) {
        return start + (Math.random() * (end - start + 1)) | 0
    }

    module.exports = MapMaker
})()