(function() {
    "use strict"
    const File = require("./File")

    /** 로그 모듈 */
    const Log = {
        /**
         * 로그에 데이터를 적음
         * @param {string} data 
         */
        save : function(data) {
            let log = File.load("Log")
            let a = new Date()
            log.push([data, a.toLocaleString()])
            File.save("Log", log)
        },

        /**
         * 로그를 특정 개수만큼 가져옴
         * @param {number} n 
         * @returns {[string, string][]}
         */
        load : function(n) {
            let log = File.load("Log")
            return log.slice(-n)
        },

        /**
         * 로그를 특정 개수만 남기고 지움
         * @param {number} n 
         */
        delete : function(n) {
            let log = File.load("Log")
            File.save("Log", log.slice(-n))
        }
    }
    
    module.exports = Log
})()