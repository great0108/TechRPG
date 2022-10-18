(function() {
    "use strict"

    const copy = {
        copy : function(obj) {
            return Object.assign({}, obj)
        },
        deepcopy : function(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
    
    module.exports = copy
})()