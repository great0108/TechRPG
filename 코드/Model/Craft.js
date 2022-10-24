(function() {
    "use strict"
    const CraftRepository = require("../Repository/CraftRepository")
    const CraftNameDto = require("../Dto/CraftNameDto")

    const Craft = function(inven, outInven) {
        this.inven = inven
        this.outInven = outInven
    }
    Craft.prototype.craft = function(item, number, craftNum) {
        let craftNameDto = new CraftNameDto(item, craftNum)
        let craftItemDto = CraftRepository.getItems(craftNameDto)
        let items = craftItemDto.items.forEach(v => v.number *= number)
        let tools = craftItemDto.tools.forEach(v => v.durability *= number)

    }

    module.exports = Craft
})()