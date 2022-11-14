(function() {
    "use strict"

    /**
     * 기본적인 아이템 정보를 담는 Dto 클래스
     * @param {string} type 
     * @param {number} stack 
     * @param {number} heat 
     */
    const BasicItemDto = function(type, stack, heat) {
        this.type = type
        this.stack = stack
        this.heat = heat
    }
    
    module.exports = BasicItemDto
})()