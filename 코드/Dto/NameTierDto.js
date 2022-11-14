(function() {
    "use strict"

    /**
     * 이름과 티어를 담는 Dto 클래스
     * @param {string} name 
     * @param {number} tier 
     */
    const NameTierDto = function(name, tier) {
        this.name = name
        this.tier = tier
    }

    module.exports = NameTierDto
})()