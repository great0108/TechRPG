// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    /** 글 Dao 클래스 */
    const WritingDao = {
        /** 글 캐시 데이터 */
        data : File.load("Writing"),

        /**
         * 해당 이름의 글 데이터를 가져옴
         * @param {string} name 
         * @returns {string}
         */
        read : function(name) {
            if(!this.data[name]) {
                Err.notExistWriting()
            }
            return Copy.deepcopy(this.data[name])
        },

        /**
         * 해당 이름의 글 데이터를 덮어 씀
         * @param {string} name 
         * @param {string} text
         */
        write : function(name, text) {
            this.data[name] = text
        },

        /**
         * 해당 이름의 글을 삭제함
         * @param {string} name 
         */
        delete : function(name) {
            delete this.data[name]
        },

        /**
         * 파일에서 글 데이터를 불러옴
         */
        load : function() {
            this.data = File.load("Writing")
        },

        /**
         * 글 캐시 데이터를 파일에 저장함
         */
        save : function() {
            File.save("Writing", this.data)
        },

        /**
         * 해당 이름의 글이 있는지 확인
         * @param {string} name 
         * @returns {boolean}
         */
        isExist : function(name) {
            return Boolean(this.data[name])
        },

        /**
         * 글 목록을 가져옴
         * @returns {string[]}
         */
        list : function() {
            return Object.keys(this.data)
        }
    }
    WritingDao.__proto__ = Dao

    module.exports = WritingDao
// })()