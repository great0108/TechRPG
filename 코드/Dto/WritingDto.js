(function() {
    "use strict"

    /**
     * 글 내용을 담는 Dto 클래스
     * @param {string} text 
     */
    const WritingDto = function(text) {
        this.text = text
    }
    
    module.exports = WritingDto
})()