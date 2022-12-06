// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    /** 바이옴 Dao 클래스 */
    const BiomeDao = {
        /** 바이옴 캐시 데이터 */
        data : File.load("Biome"),

        /**
         * 해당 이름의 바이옴 데이터를 가져옴
         * @param {string} name 
         * @returns { {items : object}} }
         */
        read : function(name) {
            if(!this.data[name]) {
                Err.NotExistBiome()
            }
            return Copy.deepcopy(this.data[name])
        },

        /**
         * 해당 이름의 바이옴 데이터를 덮어 씀
         * @param {string} name 
         * @param { {items : object} } biome 
         */
        write : function(name, biome) {
            this.data[name] = Copy.deepcopy(biome)
        },

        /**
         * 해당 이름의 바이옴을 삭제함
         * @param {string} name 
         */
        delete : function(name) {
            delete this.data[name]
        },

        /**
         * 파일에서 바이옴 데이터를 불러옴
         */
        load : function() {
            this.data = File.load("Biome")
        },

        /**
         * 바이옴 캐시 데이터를 파일에 저장함
         */
        save : function() {
            File.save("Biome", this.data)
        },

        /**
         * 해당 이름의 바이옴이 있는지 확인
         * @param {string} name 
         * @returns {boolean}
         */
        isExist : function(name) {
            return Boolean(this.data[name])
        },

        /**
         * 바이옴 목록을 가져옴
         * @returns {string[]}
         */
        list : function() {
            return Object.keys(this.data)
        }
    }
    BiomeDao.__proto__ = Dao

    module.exports = BiomeDao
// })()