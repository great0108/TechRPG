(function() {
    "use strict"

    /**
     * 조합법을 가져오기 위한 필요한 정보를 담는 Dto 클래스
     * @param {string} name 
     * @param {number} craftNum 
     */
    const CraftNameDto = function(name, craftNum) {
        this.name = name
        this.craftNum = craftNum
    }
    
    module.exports = CraftNameDto
})()