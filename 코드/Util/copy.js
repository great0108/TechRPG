(function() {
    "use strict"

    /** 복사 모듈 */
    const copy = {
        /**
         * 얕은 복사
         * @param {object} obj 
         * @returns {object}
         */
        copy : function(obj) {
            return Object.assign({}, obj)
        },

        /**
         * 깊은 복사
         * @param {object} obj 
         * @returns {object}
         */
        deepcopy : function(obj) {
            return JSON.parse(JSON.stringify(obj));
        }
    }
    
    module.exports = copy
})()