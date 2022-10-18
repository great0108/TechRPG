(function() {
    "use strict"

    const Inven = function(inven) {
        this.inven = inven
        this.invenLimit = 10
    }
    Inven.prototype.invenSpace = function() {
        return 0
    }
    Inven.prototype.itemInfo = function() {
        return ""
    }
    
    module.exports = Inven
})()