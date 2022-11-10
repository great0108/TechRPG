(function() {
    "use strict"
    const Setting = require("../Setting")
    let File = null

    if(Setting.nodeJS) {
        const fs = require("fs")
        File = {
            save : function(name, json) {
                fs.writeFileSync("./코드/Data/" + name + ".json", JSON.stringify(json), e => {if(e) throw e})
            },
            load : function(name) {
                let data = fs.readFileSync("./코드/Data/" + name + ".json", "utf8", e => {if(e) throw e})
                return JSON.parse(data) 
            }
        }
    } else {
        File = {
            save : function(name, json) {
                FileStream.write("/storage/emulated/0/global_modules/코드/Data/" + name + ".json", JSON.stringify(json))
            },
            load : function(name) {
                let data = FileStream.read("/storage/emulated/0/global_modules/코드/Data/" + name + ".json")
                return JSON.parse(data)
            }
        }
    }

    module.exports = File
})()