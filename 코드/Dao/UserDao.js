// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")
    /**
     * 유져 객체
     * @typedef {object} user
     * @property {string} name
     * @property {object[]} inven
     * @property {string} location
     * @property {object} map
     * @property {number} busyTime
     * @property {number} tier
     * @property {string|null} message
     * @property {string} version
     */

    /** 유저 Dao 클래스 */
    const UserDao = {
        /** 유저 캐시 데이터 */
        data : File.load("User"),

        /**
         * 해당 해시의 유저 데이터를 가져옴
         * @param {number} hash 
         * @returns {user}
         */
        read : function(hash) {
            if(!this.data[hash]) {
                Err.NotExistUser()
            }
            return Copy.deepcopy(this.data[hash])
        },

        /**
         * 해당 해시의 유저 데이터를 덮어 씀
         * @param {number} hash 
         * @param {user} user 
         */
        write : function(hash, user) {
            this.data[hash] = user
        },

        /**
         * 해당 해시의 유저를 삭제함
         * @param {number} hash 
         */
        delete : function(hash) {
            delete this.data[hash]
        },

        /**
         * 파일에서 유저 데이터를 불러옴
         */
        load : function() {
            this.data = File.load("User")
        },

        /**
         * 유저 캐시 데이터를 파일에 저장함
         */
        save : function() {
            File.save("User", this.data)
        },

        /**
         * 해당 해시의 유저가 있는지 확인
         * @param {number} hash 
         * @returns {boolean}
         */
        isExist : function(hash) {
            return Boolean(this.data[hash])
        },

        /**
         * 해시 목록을 가져옴
         * @returns {string[]}
         */
        list : function() {
            return Object.keys(this.data)
        }
    }
    UserDao.__proto__ = Dao

    module.exports = UserDao
// })()