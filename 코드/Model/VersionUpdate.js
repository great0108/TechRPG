(function() {
    "use strict"
    const Setting = require("../Setting")
    const UserDao = require("../Dao/UserDao")

    /** 데이터 버전 업데이트를 하는 모듈 */
    const VersionUpdate = {
        /** 유저 데이터 버전 업데이트를 함 */
        updateUser : function() {
            let list = UserDao.list()
            for(let hash of list) {
                let user = UserDao.read(hash)
                if(user.version != Setting.version) {
                    user.version = Setting.version
                }
                UserDao.write(hash, user)
            }
            UserDao.save()
        }
    }

    module.exports = VersionUpdate
})()