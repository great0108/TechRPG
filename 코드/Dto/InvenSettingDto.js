(function() {
    "use strict"

    const InvenSettingDto = function(size, canItem, canLiquid, includeItem, excludeItem, itemStack, liquidStack) {
        this.size = size
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