(function() {
    "use strict"

    /**
     * 유저 메시지를 담는 Dto 클래스
     * @param {string|null} message 
     */
    const MessageDto = function(message) {
        this.message = message
    }
    
    module.exports = MessageDto
})()