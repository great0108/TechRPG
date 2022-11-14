(function() {
    "use strict"

    /**
     * 목록을 담는 Dto 클래스
     * @param {string[]} list 
     */
    const ListDto = function(list) {
        this.list = list
    }
    
    module.exports = ListDto
})()