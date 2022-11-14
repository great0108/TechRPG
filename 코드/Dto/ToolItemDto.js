(function() {
    "use strict"

    /**
     * 도구 정보를 담는 Dto 클래스
     * @param {number} durability 
     * @param {stirng} type 
     * @param {number} tier 
     * @param {number} speed 
     * @param {number} damage 
     */
    const ToolItemDto = function(durability, type, tier, speed, damage) {
        this.durability = durability
        this.class = type
        this.tier = tier,
        this.speed = speed,
        this.damage = damage
    }
    
    module.exports = ToolItemDto
})()