(function() {
    "use strict"

    const CollectItemDto = function(collectTime, effective, tier) {
        this.collectTime = collectTime
        this.effective = effective
        this.tier = tier
    }
    
    module.exports = CollectItemDto
})()