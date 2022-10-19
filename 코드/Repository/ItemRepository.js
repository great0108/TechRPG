(function() {
    "use strict"
    const ItemDao = require("../Dao/ItemDao")
    const BasicItemDto = require("../Dto/BasicItemDto")
    const InvenSettingDto = require("../Dto/InvenSettingDto")
    const ToolItemDto = require("../Dto/ToolItemDto")

    const ItemRepository = {
        getBasicInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new BasicItemDto(item.type, item.stack || 20)
        },
        getInvenInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new InvenSettingDto(
                item.size,
                item.canItem || false, 
                item.canLiquid || false, 
                item.includeItem || [], 
                item.excludeItem || [], 
                item.itemStack, 
                item.liquidStack
            )
        },
        getToolInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new ToolItemDto(item.durability, item.class, item.tier || 0, item.speed || 1, item.damage || 0)
        }
    }

    module.exports = ItemRepository
})