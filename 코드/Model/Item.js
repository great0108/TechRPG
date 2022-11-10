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
            if(item.type === "tool") {

            } else if(item.type === "hold") {

            }
        },
        makeItem : function(name, number, nick, meta) {

        }
    }

    module.exports = Item
})()