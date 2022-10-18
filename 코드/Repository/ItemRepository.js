(function() {
    "use strict"
    const ItemDao = require("../Dao/ItemDao")
    const BasicItemDto = require("../Dto/BasicItemDto")

    const ItemRepository = {
        getBasicInfo : function(nameDto) {
            let item = ItemDao.read(nameDto.name)
            return new BasicItemDto(item.type, item.stack || 20)
        }
    }

    module.exports = ItemRepository
})