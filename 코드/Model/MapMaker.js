(function() {
    "use strict"
    const BiomeRepository = require("../Repository/BiomeRepository")
    const NameDto = require("../Dto/NameDto")
    const ItemMaker = require("./ItemMaker")

    const MapMaker = function(type, coord) {
        this.type = type
        this.coord = coord
        this.dumpItems = []

        let nameDto = new NameDto(type)
        let BiomeItemDto = BiomeRepository.getItem(nameDto)
        this.items = this.makeItems(BiomeItemDto.items)
    }
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
    MapMaker.prototype.random = function(start, end) {
        return start + (Math.random() * (end - start + 1)) | 0
    }

    module.exports = MapMaker
})()