(function() {
    "use strict"
    const Setting = require("../Setting")
    const ItemDao = require("../Dao/ItemDao")
    const BasicItemDto = require("../Dto/BasicItemDto")
    const InvenSettingDto = require("../Dto/InvenSettingDto")
    const ToolItemDto = require("../Dto/ToolItemDto")
    const IsExistDto = require("../Dto/IsExistDto")
    const CollectItemDto = require("../Dto/CollectItemDto")

    const ItemRepository = {
        getBasicInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new BasicItemDto(item.type, item.stack || Setting.itemStack, item.heat || 0)
        },
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
        getToolInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new ToolItemDto(item.durability, item.class, item.tier || 0, item.speed || 1, item.damage || 0)
        },
        isExist : function(nameDto) {
            let isExist = ItemDao.isExist(nameDto.name)
            return new IsExistDto(isExist)
        },
        getCollectInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new CollectItemDto(item.collectTime, item.effective || null, item.tier || 0)
        }
    }

    module.exports = ItemRepository
})()