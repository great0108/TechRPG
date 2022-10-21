(function() {
    "use strict"
    const BiomeDao = require("../Dao/BiomeDao")
    const BiomeItemDto = require("../Dto/BiomeItemDto")

    const BiomeRepository = {
        getItem : function(nameDto) {
            let biome = BiomeDao.read(nameDto.name)
            return new BiomeItemDto(biome.items)
        }
    }

    module.exports = BiomeRepository
})()