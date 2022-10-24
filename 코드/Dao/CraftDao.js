// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")

    const CraftDao = {
        data : File.load("Craft"),
        read : function(name) {
            if(!this.data[name]) {
                throw new Error("이런 아이템의 조합법은 존재하지 않습니다.")
            }
            return Copy.deepcopy(this.data[name])
        },
        write : function(name, craft) {
            this.data[name] = craft
        },
        delete : function(name) {
            delete this.data[name]
        },
        load : function() {
            this.data = File.load("Craft")
        },
        save : function() {
            File.save("Craft", this.data)
        },
        isExist : function(name) {
            return Boolean(this.data[name])
        }
    }
    CraftDao.__proto__ = Dao

    module.exports = CraftDao
// })()