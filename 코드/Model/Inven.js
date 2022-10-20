(function() {
    "use strict"
    const Copy = require("../Util/Copy")
    const ItemMaker = require("./ItemMaker")
    const Item = require("./Item")
    const ItemRepository = require("../Repository/ItemRepository")
    const NameDto = require("../Dto/NameDto")
    
    const Inven = function(inven, setting) {
        this.inven = inven
        this.setting = Object.assign({}, this.defaultSetting, setting)
        this.invenLimit = this.setting.invenLimit
    }
    Inven.prototype.invenInfo = function() {
        return ""
    }
    Inven.prototype.itemInfo = function() {
        return ""
    }
    Inven.prototype.defaultSetting = {
        canItem : true,
        canLiquid : false,
        includeItem : [],
        excludeItem : [],
        invenLimit : 10
        // itemStack : 20,
        // liquidStack : 1
    }
    Inven.prototype.invenSpace = function() {
        let count = 0
        for(let item of this.inven) {
            let stack = null
            if(item.type === "liquid" && this.setting.canLiquid) {
                stack = this.setting.liquidStack || item.stack
            } else if(this.setting.canItem) {
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
        let items = this.inven.filter(v => v.name === name || v.nick === name)
        if(items.length === 0) {
            return null
        }
        return items
    }
    Inven.prototype.findTool = function(effective) {
        let items = this.inven.filter(v => v.type === "tool" && v.meta.class === effective)
        if(items.length === 0) {
            return null
        }
        return items.sort((a, b) => b.meta.tier - a.meta.tier)
    }
    Inven.prototype.findItemIndex = function(name) {
        let index = this.inven.findIndex(v => v.name === name || v.nick === name)
        return index
    }
    Inven.prototype.isOverLimit = function() {
        return this.invenCal() > this.invenlimit
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

            findItem = findItem[0]
            if(findItem.stack === 1) {
                for(let j = 0; j < nums[i]; j++) {
                    let index = inven.findItemIndex(names[i])
                    if(index === -1) {
                        return [false]
                    }
                    inven.inven.splice(index, 1)
                }
            } else {
                if(findItem.number < nums[i]) {
                    return [false]
                } else if(findItem.number === nums[i]) {
                    let index = inven.findItemIndex(names[i])
                    inven.inven.splice(index, 1)
                } else {
                    findItem.number -= nums[i]
                }
            }
        }
        return [inven.inven, items]
    }
    Inven.prototype.putItems = function(names, nums, metas) {
        let inven = new Inven(Copy.deepcopy(this.inven), this.setting)
        for(let i = 0; i < names.length; i++) {
            let nameDto = new NameDto(names[i])
            let basicItemDto = ItemRepository.getBasicInfo(nameDto)

            if(basicItemDto.type === "liquid" && !this.setting.canLiquid) {
                throw new Error("액체를 담을 수 없는 공간입니다.")
            } else if(!this.setting.itemLiquid) {
                throw new Error("일반 아이템을 담을 수 없는 공간입니다.")
            }

            if(basicItemDto.stack === 1) {
                for(let j = 0; j < nums[i]; j++) {
                    inven.inven.push(new ItemMaker(names[i], 1, this.makeNick(names[i]), metas[i]))
                }
            } else {
                let findItem = inven.findItem(names[i])[0]
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
        return inven.inven
    }

    module.exports = Inven
})()