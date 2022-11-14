(function() {
    "use strict"

    /**
     * 새로운 글 정보를 담는 Dto 클래스
     * @param {string} title 
     * @param {string} text 
     */
    const MakeWritingDto = function(title, text) {
        this.title = title
        this.text = text
    }
    
    module.exports = MakeWritingDto
})()