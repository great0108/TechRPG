(function() {
    "use strict"
    const CraftRepository = require("../Repository/CraftRepository")
    const CraftNameDto = require("../Dto/CraftNameDto")
    const NameTierDto = require("../Dto/NameTierDto")

    const Craft = function(inven) {
        this.inven = inven
    }
    Craft.prototype.getBasicInfo = function(item, craftNum) {
        let craftNameDto = new CraftNameDto(item, craftNum)
        return CraftRepository.getBasicInfo(craftNameDto)
    }
    Craft.prototype.getItems = function(item, craftNum) {
        let craftNameDto = new CraftNameDto(item, craftNum)
        return CraftRepository.getItems(craftNameDto)
    }
    Craft.prototype.getCraftNum = function(item, tier) {
        let nameTierDto = new NameTierDto(item, tier)
        return CraftRepository.getCraftNum(nameTierDto).craftNum
    }
    Craft.prototype.craftInfo = function(item, craftNum) {
        let {items, tools} = this.getItems(item, craftNum)
        let {number, time, need} = this.getBasicInfo(item, craftNum)
        return "만들어 지는 개수 : " + number + "\n" +
            "필요 시간 : " + time + "초 필요 기구 : " + (need ? need : "없음") + "\n" +
            "사용 아이템\n" +
            Object.keys(items).map(v => v + " : " + items[v] + "개 사용").join("\b") + "\n" + 
            tools.map(v => v.tier ?
                v.tier + "티어 이상 " + v.class + " 도구의 내구도 : " + v.durability + "만큼 사용" :
                v.name + "의 내구도 : " + v.durability + "만큼 사용"
            ).join("\n")

    }
    Craft.prototype.craft = function(item, number, craftNum) {
        let makeNumber = this.getCraftNum(item, craftNum)
        let {items, tools} = this.getItems(item, craftNum)
        let useItems = []

        let useTool = []
        for(let tool of tools) {
            if(tool.class) {
                let a = this.inven.findTool(tool.class)
                let result = a.find(v => v.meta.tier >= tool.tier && v.meta.durability >= tool.durability * number)
                if(!result) {
                    return ["tool"]
                }
                useTool.push(result)
                useItems.push([result.nick, tool.durability * number, "tool"])
            } else {
                let result = this.inven.findItem(tool.name)
                useTool.push(result)
                useItems.push([result.nick, tool.durability * number, "tool"])
            }
        }

        let names = [], numbers = []
        for(let name in items) {
            names.push(name)
            numbers.push(items[name] * number)
            useItems.push([name, items[name] * number])
        }

        let [inven] = this.inven.getItems(names, numbers)
        if(!inven) {
            return ["inven"]
        }

        inven = inven.putItems([item], [number * makeNumber])
        if(!inven) {
            return ["space"]
        }

        for(let i = 0; i < useTool.length; i++) {
            let tool = inven.findItem(useTool[i].nick)
            if(tool.meta.durability === tools[i].durability) {
                inven.removeItem(tool.nick)
            } else {
                tool.meta.durability -= tools[i].durability
            }
        }

        return [inven, useItems]
    }

    module.exports = Craft
})()