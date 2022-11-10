(function() {
    "use strict"
    const ItemRepository = require("../Repository/ItemRepository")
    const NameDto = require("../Dto/NameDto")

    const Item = {
        getInvenSetting : function(item) {
            return ItemRepository.getInvenInfo(new NameDto(item))
        },
        getBasicInfo : function(item) {
            return ItemRepository.getBasicInfo(new NameDto(item))
        },
        getCollectInfo : function(item) {
            return ItemRepository.getCollectInfo(new NameDto(item))
        },
        getToolInfo : function(item) {
            return ItemRepository.getToolInfo(new NameDto(item))
        },
        invenItemInfo : function(item, space) {
            space = space === undefined ? "" : " ".repeat(space)
            let result = space + "이름 : " + (item.nick || item.name) + ", 개수 : " + item.number
            if(item.type === "tool") {
                result += "\n" + space + "  내구도 : " + item.meta.durability + ", 속도 : " + item.meta.speed + ", 데미지 : " + item.meta.damage || "없음"
            }
            return result
        },
        itemInfo : function(item) {
            let itemInfo = this.getBasicInfo(item)
            let result = "종류 : " + itemInfo.type + ", 스택 : " + itemInfo.stack + ", 연료량 : " + itemInfo.heat || "없음"

            let collectInfo = this.getCollectInfo(item)
            if(collectInfo.collectTime) {
                result += "수집 시간 : " + collectInfo.collectTime + ", 티어 : " + collectInfo.tier + ", 수집 도구 : " + collectInfo.effective || "없음"
            }

            if(item.type === "tool") {
                let toolInfo = this.getToolInfo(item)
                result += "내구도 : " + toolInfo.durability + ", 티어 : " + toolInfo.tier + ", 속도 : " + toolInfo.speed + ", 데미지 : " + toolInfo.damage || "없음"
            } else if(item.type === "hold") {
                let invenInfo = this.getInvenSetting(item)
                result += "저장 공간 : " + invenInfo.invenLimit + ", 아이템 저장 여부 : " + (invenInfo.canItem ? "O" : "X") +
                ", 액체 저장 여부 : " + (invenInfo.canLiquid ? "O" : "X") + "\n" + "아이템 스택 : " + invenInfo.itemStack || "없음" + "액체 스택 : " + invenInfo.liquidStack || "없음"
            }
            return result
        }
    }

    module.exports = Item
})()