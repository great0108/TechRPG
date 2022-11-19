(function() {
    "use strict"
    const Setting = require("../Setting")
    const Copy = require("../Util/Copy")
    const ItemMaker = require("./ItemMaker")
    const Item = require("./Item")
    
    /**
     * 인벤 관련 기능을 하는 모듈
     * @param {object[]} inven 
     * @param {object|undefined} setting 
     */
    const Inven = function(inven, setting) {
        this.inven = inven
        this.setting = Object.assign({}, this.defaultSetting, setting)
        this.invenLimit = this.setting.invenLimit
    }

    /**
     * 아이템 인벤에서 이름, 숫자, 메타 데이터를 가져옴
     * @param {object[]} items 
     * @returns { [string[], number[], (object|undefined)[]] }
     */
    Inven.splitItemInfo = function(items) {
        let names = [], numbers = [], metas = []
        for(let item of items) {
            names.push(item.name)
            numbers.push(item.number)
            metas.push(item.meta)
        }
        return [names, numbers, metas]
    }
    
    /** 인벤 기본 세팅 */
    Inven.prototype.defaultSetting = {
        canItem : true,
        canLiquid : false,
        includeItem : [],
        excludeItem : [],
        invenLimit : Setting.invenLimit
        // itemStack : 20,
        // liquidStack : 1
    }

    /**
     * 인벤 정보 텍스트를 만듬
     * @param {number|undefined} space 
     * @returns {string}
     */
    Inven.prototype.invenInfo = function(space) {
        space = space === undefined ? 0 : space
        let result = []
        for(let item of this.inven) {
            result.push(this.itemInfo(item, space))
        }
        return result.join("\n")
    }

    /**
     * 아이템 정보 텍스트를 만듬
     * @param {string} item 
     * @param {number|undefined} space 
     * @returns {string}
     */
    Inven.prototype.itemInfo = function(item, space) {
        let result = Item.invenItemInfo(item, space)
        if(item.type === "hold") {
            let invenSetting = Item.getInvenSetting(item.name)
            let itemInven = new Inven(item.meta.inven, invenSetting)
            result += "\n" + "  아이템 인벤 공간 : " + itemInven.invenSpace() + " / " + itemInven.invenLimit + "\n" +
                      "  아이템\n" + (itemInven.invenInfo(2) || "  없음")
        }
        return result
    }

    /**
     * 인벤을 차지한 공간을 계산함
     * @returns {number}
     */
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

    /**
     * 인벤에 특정 이름의 아이템이 있는지 확인
     * @param {string} name 
     * @returns {boolean}
     */
    Inven.prototype.isExist = function(name) {
        return this.inven.some(v => v.name === name || v.nick === name)
    }

    /**
     * 인벤에서 조건에 맞는 아이템을 가져옴
     * @param {function} fn 
     * @returns {object[]}
     */
    Inven.prototype.filter = function(fn) {
        return this.inven.filter(fn)
    }

    /**
     * 인벤에서 특정 이름의 아이템을 가져옴
     * @param {string} name 
     * @returns {object|undefined}
     */
    Inven.prototype.findItem = function(name) {
        let item = this.inven.find(v => v.name === name || v.nick === name)
        return item
    }

    /**
     * 인벤에서 특정 이름의 아이템들을 가져옴
     * @param {string} name 
     * @returns {object[]}
     */
    Inven.prototype.findItems = function(name) {
        return this.inven.filter(v => v.name === name || v.nick === name)
    }

    /**
     * 인벤에서 특정 클래스의 도구들을 가져옴
     * @param {string} effective 
     * @returns {object[]}
     */
    Inven.prototype.findTool = function(effective) {
        return this.inven.filter(v => v.type === "tool" && v.meta.class === effective)
               .sort((a, b) => b.meta.tier - a.meta.tier)
    }

    /**
     * 인벤에서 특정 이름의 아이템의 인덱스를 가져옴
     * @param {string} name 
     * @returns {number}
     */
    Inven.prototype.findItemIndex = function(name) {
        return this.inven.findIndex(v => v.name === name || v.nick === name)
    }

    /**
     * 인벤에서 특정 이름의 아이템의 인벤을 만듬
     * @param {string} name 
     * @returns {Inven}
     */
    Inven.prototype.itemInven = function(name) {
        if(!this.isExist(name) || this.findItems(name).length > 1) {
            return false
        }
        let item = this.findItem(name)
        let setting = Item.getInvenSetting(item.name)
        
        return new Inven(item.meta.inven, setting)
    }

    /**
     * 인벤에서 특정 이름의 아이템을 제거하고 제거한 아이템을 돌려줌
     * @param {string} name 
     * @returns {object}
     */
    Inven.prototype.removeItem = function(name) {
        let index = this.findItemIndex(name)
        if(index === -1) {
            return null
        }
        return this.inven.splice(index, 1)[0]
    }

    /**
     * 인벤의 저장공간을 넘었는지 확인
     * @returns {boolean}
     */
    Inven.prototype.isOverLimit = function() {
        return this.invenSpace() > this.invenlimit
    }

    /**
     * 인벤에서 특정 이름의 닉네임을 만듬
     * @param {string} name 
     * @returns 
     */
    Inven.prototype.makeNick = function(name) {
        let num = 1
        while(this.isExist(name + num)) {
            num++
        }
        return name + num
    }

    /**
     * 인벤에서 아이템들을 꺼냄
     * @param {string[]} names 
     * @param {number[]} nums 
     * @returns { [Inven|boolean, object[]|undefined] }
     */
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

    /**
     * 인벤에 아이템을 넣음
     * @param {string[]} names 
     * @param {number[]} nums 
     * @param {(object|undefined)[]} metas 
     * @returns {Inven|boolean}
     */
    Inven.prototype.putItems = function(names, nums, metas) {
        metas = metas === undefined ? [] : metas
        let inven = new Inven(Copy.deepcopy(this.inven), this.setting)
        for(let i = 0; i < names.length; i++) {
            let basicItemDto = Item.getBasicInfo(names[i])

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