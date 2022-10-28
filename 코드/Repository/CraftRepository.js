(function() {
    "use strict"
    const CraftDao = require("../Dao/CraftDao")
    const CraftNumDto = require("../Dto/CraftNumDto")
    const CraftItemDto = require("../Dto/CraftItemDto")
    const BasicCraftDto = require("../Dto/BasicCraftDto")

    const CraftRepository = {
        getAllCraftNum : function(nameDto) {
            let craft = CraftDao.read(nameDto.name)
            return new CraftNumDto(craft.length)
        },
        getCraftNum : function(nameTierDto) {
            let craft = CraftDao.read(nameTierDto.name).filter(v => v.tier <= nameTierDto.tier)
            return new CraftNumDto(craft.length)
        },
        getItems : function(craftNameDto) {
            let craft = CraftDao.read(craftNameDto.name)[craftNameDto.craftNum-1]
            return new CraftItemDto(craft.items, craft.tools || [])
        },
        getInfo : function(craftNameDto) {
            let craft = CraftDao.read(craftNameDto.name)[craftNameDto.craftNum-1]
            return new BasicCraftDto(craft.number || 1, craft.time, craft.need || "", craft.tier || 0)
        }
    }

    module.exports = CraftRepository
})()