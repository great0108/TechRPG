// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const Err = require("../Util/Err")
    const VersionUpdate = require("../Model/VersionUpdate")

    const UserDao = {
        data : File.load("User"),
        read : function(hash) {
            if(!this.data[hash]) {
                Err.NotExistUser()
            }
            return Copy.deepcopy(this.data[hash])
        },
        write : function(hash, user) {
            this.data[hash] = user
        },
        delete : function(hash) {
            delete this.data[hash]
        },
        load : function() {
            this.data = File.load("User")
        },
        save : function() {
            File.save("User", this.data)
        },
        isExist : function(hash) {
            return Boolean(this.data[hash])
        },
        list : function() {
            return Object.keys(this.data)
        }
    }
    UserDao.__proto__ = Dao

    module.exports = UserDao
// })()