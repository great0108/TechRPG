(function() {
    "use strict"
    const Setting = require("../Setting")
    const UserDao = require("../Dao/UserDao")

    const VersionUpdate = {
        updateUser : function() {
            let list = UserDao.list()
            for(let hash of list) {
                let user = UserDao.read(hash)
                if(user.version != Setting.version) {
                    user.version = Setting.version
                    UserDao.write(hash, user)
                }
            }
            UserDao.save()
        }
    }

    module.exports = VersionUpdate
})()