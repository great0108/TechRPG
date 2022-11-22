(function() {
    "use strict"

    /**
     * 유저 정보를 담는 Dto 클래스
     * @param {object} user 
     */
    const UserDto = function(user) {
        this.user = user
    }
    
    module.exports = UserDto
})()