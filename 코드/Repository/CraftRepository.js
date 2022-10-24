(function() {
    "use strict"
    const CraftDao = require("../Dao/CraftDao")
    const CraftNumDto = require("../Dto/CraftNumDto")
    const CraftItemDto = require("../Dto/CraftItemDto")

    const CraftRepository = {
        getCraftNum : function(nameDto) {
            let craft = CraftDao.read(nameDto.name)
            return new CraftNumDto(craft.length)
        },
        getItems : function(craftNameDto) {
            let craft = CraftDao.read(craftNameDto.name)[craftNameDto.craftNum]
            return new CraftItemDto(craft.items, craft.tools || [])
        }
    }

    module.exports = CraftRepository
})()