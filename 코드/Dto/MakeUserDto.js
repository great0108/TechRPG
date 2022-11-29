(function() {
    "use strict"

    /**
     * 유져 객체
     * @typedef {object} user
     * @property {string} name
     * @property {object[]} inven
     * @property {string} location
     * @property {object} map
     * @property {number} busyTime
     * @property {number} tier
     * @property {string|null} message
     * @property {string} version
     */

    /**
     * 새로운 유저 정보를 담는 Dto 클래스
     * @param {number} hash 
     * @param {user} user 
     */
    const MakeUserDto = function(hash, user) {
        this.hash = hash
        this.user = user
    }
    
    module.exports = MakeUserDto
})()