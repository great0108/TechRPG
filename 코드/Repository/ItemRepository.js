(function() {
    "use strict"
    const Setting = require("../Setting")
    const ItemDao = require("../Dao/ItemDao")
    const BasicItemDto = require("../Dto/BasicItemDto")
    const InvenSettingDto = require("../Dto/InvenSettingDto")
    const ToolItemDto = require("../Dto/ToolItemDto")
    const IsExistDto = require("../Dto/IsExistDto")
    const CollectItemDto = require("../Dto/CollectItemDto")
    const ListDto = require("../Dto/ListDto")

    /** 아이템 Repository 클래스 */
    const ItemRepository = {
        /**
         * 기본적인 아이템 정보를 가져옴
         * @param {NameDto} nameDto 
         * @returns {BasicItemDto}
         */
        getBasicInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new BasicItemDto(item.type, item.stack || Setting.itemStack, item.heat || 0)
        },

        /**
         * 아이템 인벤 세팅을 가져옴
         * @param {NameDto} nameDto 
         * @returns {InvenSettingDto}
         */
        getInvenInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new InvenSettingDto(
                item.inven.size,
                item.inven.canItem || false, 
                item.inven.canLiquid || false, 
                item.inven.includeItem || [], 
                item.inven.excludeItem || [], 
                item.inven.itemStack, 
                item.inven.liquidStack
            )
        },

        /**
         * 도구 정보를 가져옴
         * @param {NameDto} nameDto 
         * @returns {ToolItemDto}
         */
        getToolInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new ToolItemDto(item.durability, item.class, item.tier || 0, item.speed || 1, item.damage || 0)
        },

        /**
         * 아이템 수집 정보를 가져옴
         * @param {NameDto} nameDto 
         * @returns {CollectItemDto}
         */
        getCollectInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new CollectItemDto(item.collectTime, item.effective || null, item.tier || 0)
        },

        /**
         * 아이템 목록을 가져옴
         * @returns {ListDto}
         */
        getItemList : function() {
            let list = ItemDao.list()
            return new ListDto(list)
        }
    }

    module.exports = ItemRepository
})()