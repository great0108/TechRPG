(function() {
    "use strict"
    const Item = require("./Item")

    const ItemMaker = function(name, number, nick, meta) {
        this.name = name
        this.number = number

        let basicItemDto = Item.getBasicInfo(name)
        this.type = basicItemDto.type
        this.stack = basicItemDto.stack

        if(basicItemDto.type === "hold") {
            this.meta = Object.assign({inven : []}, meta)
        } else if(basicItemDto.type === "tool") {
            let toolItemDto = Item.getToolInfo(name)
            this.meta = Object.assign(toolItemDto, meta)
        } else {
            this.meta = meta
        }

        if(this.meta) {
            this.nick = nick
        }
    }

    module.exports = ItemMaker
})()