(function() {
    "use strict"

    /**
     * 새로운 유저 정보를 담는 Dto 클래스
     * @param {number} hash 
     * @param {object} user 
     */
    const MakeUserDto = function(hash, user) {
        this.hash = hash
        this.user = user
    }
    
    module.exports = MakeUserDto
})()