// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    const ItemDao = {
        data : File.load("Tutorial"),
        read : function(name) {
            return Copy.deepcopy(this.data[name])
        },
        write : function(name, value) {
            this.data[name] = value
        },
        delete : function(name) {
            delete this.data[name]
        },
        load : function() {
            this.data = File.load("Tutorial")
        },
        save : function() {
            File.save("Tutorial", this.data)
        },
        isExist : function(name) {
            return Boolean(this.data[name])
        },
        list : function() {
            return Object.keys(this.data)
        }
    }
    ItemDao.__proto__ = Dao

    module.exports = ItemDao
// })()