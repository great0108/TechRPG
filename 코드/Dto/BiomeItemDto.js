(function() {
    "use strict"

    /**
     * 바이옴 아이템 정보를 담는 Dto 클래스
     * @param {object< string : {number : number, exist : number|null, bothExist : number|null} >} items 
     */
    const BiomeItemDto = function(items) {
        this.items = items
    }
    
    module.exports = BiomeItemDto
})()