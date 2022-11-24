(function() {
    "use strict"
    const BiomeDao = require("../Dao/BiomeDao")
    const BiomeItemDto = require("../Dto/BiomeItemDto")
    const ListDto = require("../Dto/ListDto")

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
        },

        /**
         * 바이옴 목록을 가져옴
         * @returns {ListDto}
         */
        getBiomeList : function() {
            let list = BiomeDao.list()
            return new ListDto(list)
        }
    }

    module.exports = BiomeRepository
})()