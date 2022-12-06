// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    /** 아이템 Dao 클래스 */
    const ItemDao = {
        /** 아이템 캐시 데이터 */
        data : File.load("Item"),

        /**
         * 해당 이름의 아이템 데이터를 가져옴
         * @param {string} name 
         * @returns {object}
         */
        read : function(name) {
            if(!this.data[name]) {
                Err.NotExistItem()
            }
            return Copy.deepcopy(this.data[name])
        },

        /**
         * 해당 이름의 아이템 데이터를 덮어 씀
         * @param {string} name 
         * @param {object} item 
         */
        write : function(name, item) {
            this.data[name] = Copy.deepcopy(item)
        },

        /**
         * 해당 이름의 아이템을 삭제함
         * @param {string} name 
         */
        delete : function(name) {
            delete this.data[name]
        },

        /**
         * 파일에서 아이템 데이터를 불러옴
         */
        load : function() {
            this.data = File.load("Item")
        },

        /**
         * 아이템 캐시 데이터를 파일에 저장함
         */
        save : function() {
            File.save("Item", this.data)
        },

        /**
         * 해당 이름의 아이템이 있는지 확인
         * @param {string} name 
         * @returns {boolean}
         */
        isExist : function(name) {
            return Boolean(this.data[name])
        },

        /**
         * 아이템 목록을 가져옴
         * @returns {string[]}
         */
        list : function() {
            return Object.keys(this.data)
        }
    }
    ItemDao.__proto__ = Dao

    module.exports = ItemDao
// })()