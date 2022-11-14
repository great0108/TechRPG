(function() {
    "use strict"

    /**
     * 무언가가 있는지 여부를 담는 Dto 클래스
     * @param {boolean} isExist 
     */
    const IsExistDto = function(isExist) {
        this.isExist = isExist
    }
    
    module.exports = IsExistDto
})()