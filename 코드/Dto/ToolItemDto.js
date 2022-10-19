(function() {
    "use strict"

    const ToolItemDto = function(durability, type, tier, speed, damage) {
        this.durability = durability
        this.class = type
        this.tier = tier,
        this.speed = speed,
        this.damage = damage
    }
    
    module.exports = ToolItemDto
})()