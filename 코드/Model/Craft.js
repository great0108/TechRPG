(function() {
    "use strict"
    const CraftRepository = require("../Repository/CraftRepository")
    const CraftNameDto = require("../Dto/CraftNameDto")
    const NameTierDto = require("../Dto/NameTierDto")
    const NameDto = require("../Dto/nameDto")

    /**
     * 제작 관련 기능을 하는 모듈
     * @param {object[]} inven 
     */
    const Craft = function(inven) {
        this.inven = inven
    }

    /**
     * 특정 아이템의 제작법이 있는지 확인
     * @param {string} item 
     * @returns {boolean}
     */
    Craft.prototype.isExist = function(item) {
        let nameDto = new NameDto(item)
        return CraftRepository.isExist(nameDto).isExist
    }

    /**
     * 기본적인 제작법 정보를 가져옴
     * @param {string} item 
     * @param {number} craftNum 
     * @returns {BasicCraftDto}
     */
    Craft.prototype.getBasicInfo = function(item, craftNum) {
        let craftNameDto = new CraftNameDto(item, craftNum)
        return CraftRepository.getBasicInfo(craftNameDto)
    }

    /**
     * 제작 아이템 정보를 가져옴
     * @param {string} item 
     * @param {number} craftNum 
     * @returns {CraftItemDto}
     */
    Craft.prototype.getItems = function(item, craftNum) {
        let craftNameDto = new CraftNameDto(item, craftNum)
        return CraftRepository.getItems(craftNameDto)
    }

    /**
     * 아이템의 제작법 개수를 가져옴
     * @param {string} item 
     * @param {number} tier 
     * @returns {number}
     */
    Craft.prototype.getCraftNum = function(item, tier) {
        let nameTierDto = new NameTierDto(item, tier)
        return CraftRepository.getCraftNum(nameTierDto).craftNum
    }

    /**
     * 제작법 정보 텍스트를 만듬
     * @param {string} item 
     * @param {number} craftNum 
     * @returns {string}
     */
    Craft.prototype.craftInfo = function(item, craftNum) {
        let {items, tools} = this.getItems(item, craftNum)
        let {number, time, need} = this.getBasicInfo(item, craftNum)
        return "만들어 지는 개수 : " + number + "\n" +
            "필요 시간 : " + time + "초, 필요 기구 : " + (need ? need : "없음") + "\n" +
            "사용 아이템\n" +
            Object.keys(items).map(v => v + " : " + items[v] + "개 사용").join("\n") +
            (tools.length === 0 ? "" : "\n" + tools.map(v => v.tier ?
                v.tier + "티어 이상 " + v.class + " 도구의 내구도 : " + v.durability + "만큼 사용" :
                v.name + "의 내구도 : " + v.durability + "만큼 사용"
            ).join("\n"))
    }

    /**
     * 여러 제작법 정보 텍스트를 만듬
     * @param {string} item 
     * @param {number} num 
     * @returns {string}
     */
    Craft.prototype.craftInfos = function(item, num) {
        let craftInfo = []
        for(let i = 0; i < num; i++) {
            craftInfo.push(this.craftInfo(item, i+1))
        }
        return craftInfo.map((v, i) => (i+1) + "번 조합법\n" + v).join("\n\n")
    }

    /**
     * 아이템을 제작한 인벤토리를 돌려줌
     * @param {string} item 
     * @param {number} number 
     * @param {number} craftNum 
     * @returns { [Inven|string, array<[string, number, string|undefined]>|undefined] }
     */
    Craft.prototype.craft = function(item, number, craftNum) {
        let makeNumber = this.getBasicInfo(item, craftNum).number
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