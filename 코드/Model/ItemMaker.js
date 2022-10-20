(function() {
    "use strict"
    const ItemRepository = require("../Repository/ItemRepository")
    const NameDto = require("../Dto/NameDto")

    const ItemMaker = function(name, number, meta) {
        this.name = name
        this.number = number

        let nameDto = new NameDto(name)
        let basicItemDto = ItemRepository.getBasicInfo(nameDto)
        this.type = basicItemDto.type
        this.stack = basicItemDto.stack

        if(type === "hold") {
            this.meta = Object.assign({inven : []}, meta)
        } else if(type === "tool") {
            let toolItemDto = ItemRepository.getToolInfo(nameDto)
            this.meta = Object.assign(toolItemDto, meta)
        } else {
            this.meta = meta || {}
        }
    }

    module.exports = ItemMaker
})