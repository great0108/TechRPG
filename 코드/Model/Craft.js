(function() {
    "use strict"
    const CraftRepository = require("../Repository/CraftRepository")
    const CraftNameDto = require("../Dto/CraftNameDto")

    const Craft = function(inven) {
        this.inven = inven
    }
    Craft.prototype.craftInfo = function(item, craftNum) {
        return ""
    }
    Craft.prototype.craft = function(item, number, craftNum) {
        let craftNameDto = new CraftNameDto(item, craftNum)
        let craftItemDto = CraftRepository.getItems(craftNameDto)
        let {items, tools} = craftItemDto

        let useTool = []
        for(let tool of tools) {
            let a = this.inven.findTool(tool.class)
            let result = a.find(v => v.meta.tier >= tool.tier && v.meta.durability >= tool.durability * number)
            if(!result) {
                return "tool"
            }
            useTool.push(result)
        }

        let names = [], numbers = []
        for(let name in items) {
            names.push(name)
            numbers.push(items[name] * number)
        }

        let [inven] = this.inven.getItems(names, numbers)
        if(!inven) {
            return "inven"
        }

        let inven2 = inven.putItems([item], [number])
        if(!inven2) {
            return "space"
        }

        for(let i = 0; i < useTool.length; i++) {
            let tool = useTool[i]
            if(tool.meta.durability === tools[i].durability) {
                inven.removeItem(tool.nick)
            } else {
                tool.meta.durability -= tools[i].durability
            }
        }

        return inven2
    }

    module.exports = Craft
})()