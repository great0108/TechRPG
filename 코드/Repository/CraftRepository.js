(function() {
    "use strict"
    const CraftDao = require("../Dao/CraftDao")
    const CraftNumDto = require("../Dto/CraftNumDto")
    const CraftItemDto = require("../Dto/CraftItemDto")
    const BasicCraftDto = require("../Dto/BasicCraftDto")
    const IsExistDto = require("../Dto/IsExistDto")

    /** 제작 Repository 클래스 */
    const CraftRepository = {
        /**
         * 특정 아이템의 제작법이 있는지 확인
         * @param {NameDto} nameDto 
         * @returns {IsExistDto}
         */
        isExist : function(nameDto) {
            let result = CraftDao.isExist(nameDto.name)
            return new IsExistDto(result)
        },

        /**
         * 특정 아이템의 모든 제작법 개수를 가져옴
         * @param {NameDto} nameDto 
         * @returns {CraftNumDto}
         */
        getAllCraftNum : function(nameDto) {
            let craft = CraftDao.read(nameDto.name)
            return new CraftNumDto(craft.length)
        },

        /**
         * 특정 아이템의 사용 가능한 제작법 개수를 가져옴
         * @param {NameTierDto} nameTierDto 
         * @returns {CraftNumDto}
         */
        getCraftNum : function(nameTierDto) {
            let craft = CraftDao.read(nameTierDto.name).filter(v => v.tier <= nameTierDto.tier)
            return new CraftNumDto(craft.length)
        },

        /**
         * 제작에 필요한 아이템 정보를 가져옴
         * @param {CraftNameDto} craftNameDto 
         * @returns {CraftItemDto}
         */
        getItems : function(craftNameDto) {
            let craft = CraftDao.read(craftNameDto.name)[craftNameDto.craftNum]
            return new CraftItemDto(craft.items, craft.tools || [])
        },

        /**
         * 기본적인 제작법 정보를 가져옴
         * @param {CraftNameDto} craftNameDto 
         * @returns {BasicCraftDto}
         */
        getBasicInfo : function(craftNameDto) {
            let craft = CraftDao.read(craftNameDto.name)[craftNameDto.craftNum]
            return new BasicCraftDto(craft.number || 1, craft.time, craft.need || "", craft.tier || 0)
        }
    }

    module.exports = CraftRepository
})()