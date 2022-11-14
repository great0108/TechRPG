(function() {
    "use strict"

    /**
     * 인벤토리 세팅 정보를 담는 Dto 클래스
     * @param {number} size 
     * @param {boolean} canItem 
     * @param {boolean} canLiquid 
     * @param {string[]} includeItem 
     * @param {string[]} excludeItem 
     * @param {number|undefined} itemStack 
     * @param {number|undefined} liquidStack 
     */
    const InvenSettingDto = function(size, canItem, canLiquid, includeItem, excludeItem, itemStack, liquidStack) {
        this.invenLimit = size
        this.canItem = canItem
        this.canLiquid = canLiquid
        this.includeItem = includeItem
        this.excludeItem = excludeItem
        if(itemStack) {
            this.itemStack = itemStack
        }
        if(liquidStack) {
            this.liquidStack = liquidStack
        }
    }
    
    module.exports = InvenSettingDto
})()