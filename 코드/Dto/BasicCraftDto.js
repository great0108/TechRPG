(function() {
    "use strict"

    /**
     * 기본적인 제작법 정보를 담는 Dto 클래스
     * @param {number} number 
     * @param {number} time 
     * @param {string} need 
     * @param {number} tier 
     */
    const BasicCraftDto = function(number, time, need, tier) {
        this.number = number
        this.time = time
        this.need = need
        this.tier = tier
    }
    
    module.exports = BasicCraftDto
})()