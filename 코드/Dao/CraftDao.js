// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    /** 제작법 Dao 클래스 */
    const CraftDao = {
        /** 제작법 캐시 데이터 */
        data : File.load("Craft"),

        /**
         * 해당 아이템의 제작법 데이터를 가져옴
         * @param {string} name 
         * @returns {object[]}
         */
        read : function(name) {
            if(!this.data[name]) {
                Err.NotExistCraft()
            }
            return Copy.deepcopy(this.data[name])
        },

        /**
         * 해당 아이템의 제작법 데이터를 덮어 씀
         * @param {string} name 
         * @param {object[]} craft 
         */
        write : function(name, craft) {
            this.data[name] = Copy.deepcopy(craft)
        },

        /**
         * 해당 아이템의 제작법을 삭제함
         * @param {string} name 
         */
        delete : function(name) {
            delete this.data[name]
        },

        /**
         * 파일에서 제작법 데이터를 불러옴
         */
        load : function() {
            this.data = File.load("Craft")
        },

        /**
         * 제작법 캐시 데이터를 파일에 저장함
         */
        save : function() {
            File.save("Craft", this.data)
        },

        /**
         * 해당 아이템의 제작법이 있는지 확인
         * @param {string} name 
         * @returns {boolean}
         */
        isExist : function(name) {
            return Boolean(this.data[name])
        },

        /**
         * 제작법 목록을 가져옴
         * @returns {string[]}
         */
        list : function() {
            return Object.keys(this.data)
        }
    }
    CraftDao.__proto__ = Dao

    module.exports = CraftDao
// })()