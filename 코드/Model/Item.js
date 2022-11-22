(function() {
    "use strict"
    const Err = require("../Util/Err")
    const ItemRepository = require("../Repository/ItemRepository")
    const NameDto = require("../Dto/NameDto")

    /** 아이템 관련 기능을 하는 모듈 */
    const Item = {
        /**
         * 아이템 인벤 세팅을 가져옴
         * @param {string} item 
         * @returns {InvenSettingDto}
         */
        getInvenSetting : function(item) {
            let itemInfo = this.getBasicInfo(item)
            if(!["store", "hold"].includes(itemInfo.type)) {
                Err.NotHaveInven()
            }
            return ItemRepository.getInvenInfo(new NameDto(item))
        },

        /**
         * 기본적인 아이템 정보를 가져옴
         * @param {string} item 
         * @returns {BasicItemDto}
         */
        getBasicInfo : function(item) {
            return ItemRepository.getBasicInfo(new NameDto(item))
        },

        /**
         * 아이템 수집 정보를 가져옴
         * @param {string} item 
         * @returns {CollectItemDto}
         */
        getCollectInfo : function(item) {
            return ItemRepository.getCollectInfo(new NameDto(item))
        },

        /**
         * 도구 점보를 가져옴
         * @param {string} item 
         * @returns {ToolItemDto}
         */
        getToolInfo : function(item) {
            return ItemRepository.getToolInfo(new NameDto(item))
        },

        /**
         * 아이템 목록을 가져옴
         * @returns {string[]}
         */
        getList : function() {
            return ItemRepository.getItemList().list
        },

        /**
         * 인벤에 있는 아이템 정보 텍스트를 만듬
         * @param {string} item 
         * @param {number|undefined} space 
         * @returns {string}
         */
        invenItemInfo : function(item, space) {
            space = space === undefined ? "" : " ".repeat(space)
            let result = space + "이름 : " + (item.nick || item.name) + ", 개수 : " + item.number
            if(item.type === "tool") {
                result += "\n" + space + "  내구도 : " + item.meta.durability + ", 속도 : " + item.meta.speed + ", 데미지 : " + (item.meta.damage || "없음")
            }
            return result
        },

        /**
         * 아이템 정보 텍스트를 만듬
         * @param {string} item 
         * @returns {string}
         */
        itemInfo : function(item) {
            let itemInfo = this.getBasicInfo(item)
            let result = "종류 : " + itemInfo.type + ", 스택 : " + itemInfo.stack + ", 연료량 : " + (itemInfo.heat || "없음")

            let collectInfo = this.getCollectInfo(item)
            if(collectInfo.collectTime) {
                result += "\n수집 시간 : " + collectInfo.collectTime + ", 티어 : " + collectInfo.tier + ", 수집 도구 : " + (collectInfo.effective || "없음")
            }

            if(itemInfo.type === "tool") {
                let toolInfo = this.getToolInfo(item)
                result += "\n내구도 : " + toolInfo.durability + ", 티어 : " + toolInfo.tier + ", 속도 : " + toolInfo.speed + ", 데미지 : " + (toolInfo.damage || "없음")
            } else if(itemInfo.type === "hold") {
                let invenInfo = this.getInvenSetting(item)
                result += "\n저장 공간 : " + invenInfo.invenLimit + ", 아이템 저장 여부 : " + (invenInfo.canItem ? "O" : "X") +
                ", 액체 저장 여부 : " + (invenInfo.canLiquid ? "O" : "X") + "\n" + "아이템 스택 : " + (invenInfo.itemStack || "없음") + ", 액체 스택 : " + (invenInfo.liquidStack || "없음")
            }
            return result
        }
    }

    module.exports = Item
})()