(function() {
    "use strict"
    const ItemRepository = require("../Repository/ItemRepository")
    const NameDto = require("../Dto/NameDto")

    const ItemMaker = function(name, number, type, stack, meta) {
        this.name = name
        this.number = number
        this.type = type
        this.stack = stack
        if(type === "hold") {
            this.meta = Object.assign({inven : []}, meta)
        } else if(type === "tool") {
            let nameDto = new NameDto(name)
            let toolItemDto = ItemRepository.getToolInfo(nameDto)
            this.meta = Object.assign(toolItemDto, meta)
        } else {
            this.meta = meta || {}
        }
    }

    module.exports = ItemMaker
})