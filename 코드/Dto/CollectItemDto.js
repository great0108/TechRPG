(function() {
    "use strict"

    /**
     * 아이템 수집 관련 정보를 담는 Dto 클래스
     * @param {number} collectTime 
     * @param {string|null} effective 
     * @param {number} tier 
     */
    const CollectItemDto = function(collectTime, effective, tier) {
        this.collectTime = collectTime
        this.effective = effective
        this.tier = tier
    }
    
    module.exports = CollectItemDto
})()