(function() {
    "use strict"
    const BiomeDao = require("../Dao/BiomeDao")
    const BiomeItemDto = require("../Dto/BiomeItemDto")

    /** 바이옴 Repository 클래스 */
    const BiomeRepository = {
        /**
         * 바이옴 아이템 정보를 가져옴
         * @param {NameDto} nameDto 
         * @returns {BiomeItemDto}
         */
        getItem : function(nameDto) {
            let biome = BiomeDao.read(nameDto.name)
            return new BiomeItemDto(biome.items)
        }
    }

    module.exports = BiomeRepository
})()