(function() {
    "use strict"
    const ItemRepository = require("../Repository/ItemRepository")
    const NameDto = require("../Dto/NameDto")
    
    const DefaultSetting = {
        canItem : true,
        canLiquid : false,
        includeItem : [],
        excludeItem : []
    }

    const Inven = function(inven, setting) {
        this.inven = inven
        this.invenLimit = 10
        this.setting = setting || DefaultSetting
    }
    Inven.prototype.invenSpace = function() {
        let count = 0
        for(let item of this.inven) {
            let nameDto = new NameDto(item.name)
            let basicItemDto = ItemRepository.getBasicInfo(nameDto)
            let stack = null
            if(basicItemDto.type === "liquid" && this.setting.canLiquid) {
                stack = basicItemDto.stack
            } else if(this.setting.canItem) {
                stack = basicItemDto.stack
            }

            if(!stack) {
                throw new Error("인벤토리 아이템 종류 에러")
            }
            count += Math.ceil(item.number / stack)
        }
        return count
    }
    Inven.prototype.itemInfo = function() {
        return ""
    }
    Inven.prototype.isExist = function(name) {
        return this.inven.some(v => v.name === name)
    }
    Inven.prototype.findItem = function(name) {
        let items = this.inven.filter(v => v.name === name)
        if(items.length === 0) {
            return null
        }
        return items
    }
    Inven.prototype.findItemIndex = function(name) {
        let index = this.inven.findIndex(v => v.name === name)
        return index
    }
    Inven.prototype.isOverLimit = function() {
        return this.invenCal() > this.invenlimit
    }
    Inven.prototype.getItems = function(names, nums) {
        let inven = new Inven(Utils.copy(this.inven), this.invenlimit)
        for(let i = 0; i < names.length; i++) {
            let iteminfo = ItemRepository.read(names[i])
            let finditem = inven.findAnyItem(names[i], true)
            let choice = null
            if(finditem.length > 1) {
                if(this.invenchoice[0]) {
                    choice = invenchoice-1
                    finditem = finditem[invenchoice]
                    this.invenchoice.shift()
                } else {
                    return finditem;  //User에서 처리
                }
            } else if(finditem.length === 1) {
                finditem = finditem[0]
            }
            if(iteminfo.islap) {
                if(finditem.number < nums[i]) {
                    ErrorHandler.throw("아이템 개수가 부족합니다.")
                }
                if(finditem.number > nums[i]) {
                    finditem.number -= nums[i]
                } else {
                    inven.splice(inven.findItemIndex(names[i]), 1)
                }
            } else {
                let index = 0
                let count = -1
                for(; index < inven.length; index++) {
                    if(inven[index].name == names[i]) {
                        count++
                    }
                    if(count === choice) {
                        break;
                    }
                }
                inven.splice(index, 1)
                if(nums[i] > 1) {
                  nums[i]--
                  i--
                }
            }
        }
        return inven
    }
    Inven.prototype.putItems = function(names, nums, metas) {
        let inven = new Inven(Utils.copy(this.inven), this.invenlimit)
        for(let i = 0; i < names.length; i++) {
            let iteminfo = ItemRepository.read(names[i])
            metas[i] = metas[i] || iteminfo.meta
            if(iteminfo.type === "liquid" && !this.lapNum.liquid) {
                ErrorHandler.throw("액체를 담을 수 없는 공간입니다.")
            } else if(iteminfo.type !== "liquid" && !this.lapNum.item) {
                ErrorHandler.throw("일반 아이템을 담을 수 없는 공간입니다.")
            }
            if(iteminfo.islap) {
                let finditem = inven.findItem(names[i]).find(v => Utils.equal(v.metas, metas[i]))
                if(finditem) {
                    finditem.number += nums[i]
                } else {
                    inven.push(new ItemMaker(names[i], nums[i], metas[i]))
                }
            } else {
                for(let j = 0; j < nums[i]; j++) {
                    inven.push(new ItemMaker(names[i], 1, metas[i]))
                }
            }
        }
    }
    
    module.exports = Inven
})()