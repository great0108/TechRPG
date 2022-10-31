// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    const ItemDao = {
        data : File.load("Item"),
        read : function(name) {
            if(!this.data[name]) {
                Err.NotExistItem()
            }
            return Copy.deepcopy(this.data[name])
        },
        write : function(name, item) {
            this.data[name] = item
        },
        delete : function(name) {
            delete this.data[name]
        },
        load : function() {
            this.data = File.load("Item")
        },
        save : function() {
            File.save("Item", this.data)
        },
        isExist : function(name) {
            return Boolean(this.data[name])
        }
    }
    ItemDao.__proto__ = Dao

    module.exports = ItemDao
// })()