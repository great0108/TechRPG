// (function() {
    "use strict"
    const Dao = require("./Dao")
    const File = require("../Util/File")
    const Copy = require("../Util/Copy")
    const VersionUpdate = require("../Model/VersionUpdate")

    const UserDao = {
        data : File.load("User"),
        read : function(hash) {
            if(!this.data[hash]) {
                throw new Error("이런 이름의 유저는 존재하지 않습니다.")
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
        update : function() {
            for(let hash in this.data) {
                VersionUpdate.updateUser(this.data[hash])
            }
        }
    }
    UserDao.__proto__ = Dao

    module.exports = UserDao
// })()