(function() {
    "use strict"
    const fs = require("fs")

    const File = {
        save : function(name, json) {
            fs.writeFile("./코드/Data/" + name + ".json", JSON.stringify(json), e => {if(e) throw e})
        },
        load : function(name) {
            let data = fs.readFileSync("./코드/Data/" + name + ".json", "utf8", e => {if(e) throw e})
            return JSON.parse(data) 
        }
    }
    module.exports = File
})()