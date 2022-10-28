(function() {
    "use strict"

    const BasicCraftDto = function(number, time, need, tier) {
        this.number = number
        this.time = time
        this.need = need
        this.tier = tier
    }
    
    module.exports = BasicCraftDto
})()