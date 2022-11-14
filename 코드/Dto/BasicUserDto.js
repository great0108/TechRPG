(function() {
    "use strict"

    /**
     * 기본적인 유저 정보를 담는 Dto 클래스
     * @param {string} name 
     * @param {string} location 
     * @param {number} busyTime 
     * @param {number} tier 
     */
    const BasicUserDto = function(name, location, busyTime, tier) {
        this.name = name
        this.location = location
        this.busyTime = busyTime
        this.tier = tier
    }
    
    module.exports = BasicUserDto
})()