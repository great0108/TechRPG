// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")

    const ItemDao = {
        data : File.load("Writing"),
        read : function(name) {
            if(!this.data[name]) {
                Err.notExistWriting()
            }
            return Copy.deepcopy(this.data[name])
        },
        write : function(name, value) {
            this.data[name] = value
        },
        delete : function(name) {
            delete this.data[name]
        },
        load : function() {
            this.data = File.load("Writing")
        },
        save : function() {
            File.save("Writing", this.data)
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