(function() {
    "use strict"
    const File = require("./File")

    const Log = {
        print : function(data) {
            let log = File.load("Log")
            let a = new Date()
            log.push([data, a.toLocaleString()])
            File.save("Log", log)
        },
        load : function(n) {
            let log = File.load("Log")
            return log.slice(-n)
        },
        delete : function(n) {
            let log = File.load("Log")
            File.save("Log", log.slice(-n))
        }
    }
    
    module.exports = Log
})