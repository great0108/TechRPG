(function() {
    "use strict"

    /**
     * 유저 데이터를 만드는 모듈
     */
    const UserData = function() {
    }

    /**
     * 유저 인벤을 설정함
     * @param {object[]} inven 
     * @returns {UserData}
     */
    UserData.prototype.setInven = function(inven) {
        this.inven = inven
        return this
    }

    /**
     * 유저 맵을 설정함
     * @param {object} map 
     * @returns {UserData}
     */
    UserData.prototype.setMap = function(map) {
        this.map = map
        return this
    }

    /**
     * 유저 위치를 설정함
     * @param {string} location 
     * @returns {UserData}
     */
    UserData.prototype.setLocation = function(location) {
        this.location = location
        return this
    }

    /**
     * 유저가 바쁜 시간을 설정함
     * @param {number} busyTime 
     * @returns {UserData}
     */
    UserData.prototype.setBusyTime = function(busyTime) {
        this.busyTime = busyTime
        return this
    }

    /**
     * 유저 티어를 설정함
     * @param {number} tier 
     * @returns {UserData}
     */
    UserData.prototype.setTier = function(tier) {
        this.tier = tier
        return this
    }

    /**
     * 유저 메시지를 설정함
     * @param {string} message 
     * @returns {UserData}
     */
    UserData.prototype.setMessage = function(message) {
        this.message = message
        return this
    }

    module.exports = UserData
})()