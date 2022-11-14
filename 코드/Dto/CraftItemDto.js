(function() {
    "use strict"

    /**
     * 제작에 필요한 아이템 정보를 담는 Dto 클래스
     * @param {object<string : number>} items 
     * @param {object<durability : number, class : string|undefined, tier : string|undefined, name : string|undefined>[]} tools 
     */
    const CraftItemDto = function(items, tools) {
        this.items = items
        this.tools = tools
    }
    
    module.exports = CraftItemDto
})()