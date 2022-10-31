// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    const CraftDao = {
        data : File.load("Craft"),
        read : function(name) {
            if(!this.data[name]) {
                Err.NotExistCraft()
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