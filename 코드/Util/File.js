(function() {
    "use strict"
    const Setting = require("../Setting")
    /** 파일 입출력 모듈 */
    let File = null

    if(Setting.nodeJS) {
        const fs = require("fs")
        File = {
            /**
             * 데이터를 파일에 저장
             * @param {string} name 
             * @param {object} json 
             */
            save : function(name, json) {
                fs.writeFileSync("./코드/Data/" + name + ".json", JSON.stringify(json), e => {if(e) throw e})
            },

            /**
             * 데이터를 파일에서 불러옴
             * @param {string} name 
             * @returns {object}
             */
            load : function(name) {
                let data = fs.readFileSync("./코드/Data/" + name + ".json", "utf8", e => {if(e) throw e})
                return JSON.parse(data) 
            }
        }
    } else {
        File = {
            /**
             * 데이터를 파일에 저장
             * @param {string} name 
             * @param {object} json 
             */
            save : function(name, json) {
                FileStream.write("/storage/emulated/0/global_modules/코드/Data/" + name + ".json", JSON.stringify(json))
            },

            /**
             * 데이터를 파일에서 불러옴
             * @param {string} name 
             * @returns {object}
             */
            load : function(name) {
                let data = FileStream.read("/storage/emulated/0/global_modules/코드/Data/" + name + ".json")
                return JSON.parse(data)
            }
        }
    }

    module.exports = File
})()