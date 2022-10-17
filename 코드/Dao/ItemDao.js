// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")

    const ItemDao = {
        data : File.load("Item"),
        read : function(name) {
            if(!this.data[name]) {
                throw new Error("이런 이름의 아이템은 존재하지 않습니다.")
            }
            return this.data[name]
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