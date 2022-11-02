(function() {
    "use strict"
    const Setting = require("../Setting")
    const Copy = require("../Util/Copy")
    const ItemMaker = require("./ItemMaker")
    const ItemRepository = require("../Repository/ItemRepository")
    const NameDto = require("../Dto/NameDto")
    
    const Inven = function(inven, setting) {
        this.inven = inven
        this.setting = Object.assign({}, this.defaultSetting, setting)
        this.invenLimit = this.setting.invenLimit
    }
    Inven.splitItemInfo = function(items) {
        let names = [], numbers = [], metas = []
        for(let item of items) {
            names.push(item.name)
            numbers.push(item.number)
            metas.push(item.meta)
        }
        return [names, numbers, metas]
    }
    Inven.prototype.defaultSetting = {
        canItem : true,
        canLiquid : false,
        includeItem : [],
        excludeItem : [],
        invenLimit : Setting.invenLimit
        // itemStack : 20,
        // liquidStack : 1
    }
    Inven.prototype.invenInfo = function(space) {
        space = space === undefined ? 0 : space
        let result = []
        for(let item of this.inven) {
            result.push(this.itemInfo(item, space))
        }
        return result.join("\n")
    }
    Inven.prototype.itemInfo = function(item, space) {
        space = space === undefined ? "" : " ".repeat(space)
        let result = space + "이름 : " + (item.nick || item.name) + ", 개수 : " + item.number
        if(item.type === "hold") {
            let nameDto = new NameDto(item.name)
            let invenSetting = ItemRepository.getInvenInfo(nameDto)
            let itemInven = new Inven(item.meta.inven, invenSetting)
            result += "\n" + "  아이템 인벤 공간 : " + itemInven.invenSpace() + " / " + itemInven.invenLimit + "\n" +
                      "  아이템\n" + (itemInven.invenInfo(2) || "  없음")
        } else if(item.type === "tool") {
            result += "\n" + space + "  내구도 : " + item.meta.durability + ", 속도 : " + item.meta.speed + ", 데미지 : " + item.meta.damage || "없음"
        }
        return result
    }
    Inven.prototype.invenSpace = function() {
        let count = 0
        for(let item of this.inven) {
            let stack = null
            if(item.type === "liquid" && (this.setting.canLiquid || this.setting.includeItem.includes(item))) {
                stack = this.setting.liquidStack || item.stack
            } else if(this.setting.canItem || this.setting.includeItem.includes(item)) {
                stack = this.setting.itemStack || item.stack
            }

            if(item.stack === 1) {
                stack = 1
            }

            if(!stack) {
                throw new Error("인벤토리 아이템 종류 에러")
            }
            count += Math.ceil(item.number / stack)
        }
        return count
    }
    Inven.prototype.isExist = function(name) {
        return this.inven.some(v => v.name === name || v.nick === name)
    }
    Inven.prototype.filter = function(fn) {
        return this.inven.filter(fn)
    }
    Inven.prototype.findItem = function(name) {
        let item = this.inven.find(v => v.name === name || v.nick === name)
        return item
    }
    Inven.prototype.findItems = function(name) {
        return this.inven.filter(v => v.name === name || v.nick === name)
    }
    Inven.prototype.findTool = function(effective) {
        return this.inven.filter(v => v.type === "tool" && v.meta.class === effective)
               .sort((a, b) => b.meta.tier - a.meta.tier)
    }
    Inven.prototype.findItemIndex = function(name) {
        return this.inven.findIndex(v => v.name === name || v.nick === name)
    }
    Inven.prototype.getCollectInfo = function(item) {
        let nameDto = new NameDto(item)
        return ItemRepository.getCollectInfo(nameDto)
    }
    Inven.prototype.itemInven = function(name) {
        if(!this.isExist(name) || this.findItems(name).length > 1) {
            return false
        }
        let item = this.inven.findItem(name)
        let nameDto = new NameDto(item.name)
        let setting = ItemRepository.getInvenInfo(nameDto)
        
        return new Inven(item.meta.inven, setting)
    }
    Inven.prototype.removeItem = function(name) {
        let index = this.findItemIndex(name)
        if(index === -1) {
            return null
        }
        return this.inven.splice(index, 1)[0]
    }
    Inven.prototype.isOverLimit = function() {
        return this.invenSpace() > this.invenlimit
    }
    Inven.prototype.makeNick = function(name) {
        let num = 1
        while(this.isExist(name + num)) {
            num++
        }
        return name + num
    }
    Inven.prototype.getItems = function(names, nums) {
        let inven = new Inven(Copy.deepcopy(this.inven), this.setting)
        let items = []
        for(let i = 0; i < names.length; i++) {
            let findItem = inven.findItem(names[i])
            if(!findItem) {
                return [false]
            }

            if(findItem.stack === 1) {
                for(let j = 0; j < nums[i]; j++) {
                    let item = inven.removeItem(names[i])
                    if(item === null) {
                        return [false]
                    }
                    items.push(item)
                }
            } else {
                if(findItem.number < nums[i]) {
                    return [false]
                } else if(findItem.number === nums[i]) {
                    let index = inven.findItemIndex(names[i])
                    items.push(inven.inven.splice(index, 1)[0])
                } else {
                    findItem.number -= nums[i]
                    items.push(new ItemMaker(names[i], nums[i]))
                }
            }
        }
        return [inven, items]
    }
    Inven.prototype.putItems = function(names, nums, metas) {
        metas = metas === undefined ? [] : metas
        let inven = new Inven(Copy.deepcopy(this.inven), this.setting)
        for(let i = 0; i < names.length; i++) {
            let nameDto = new NameDto(names[i])
            let basicItemDto = ItemRepository.getBasicInfo(nameDto)

            if(!this.setting.includeItem.includes(names[i])) {
                if(this.setting.excludeItem.includes(names[i])) {
                    throw new Error("이 아이템은 담을 수 없습니다.")
                }
                if(basicItemDto.type === "liquid" && !this.setting.canLiquid) {
                    throw new Error("액체를 담을 수 없는 공간입니다.")
                } else if(!this.setting.canItem) {
                    throw new Error("일반 아이템을 담을 수 없는 공간입니다.")
                }
            }

            if(basicItemDto.stack === 1) {
                for(let j = 0; j < nums[i]; j++) {
                    inven.inven.push(new ItemMaker(names[i], 1, inven.makeNick(names[i]), metas[i]))
                }
            } else {
                let findItem = inven.findItem(names[i])
                if(findItem) {
                    findItem.number += nums[i]
                } else {
                    inven.inven.push(new ItemMaker(names[i], nums[i]))
                }
            }
        }
        if(inven.isOverLimit()) {
            return false
        }
        return inven
    }

    module.exports = Inven
})()