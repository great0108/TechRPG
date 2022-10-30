(function() {
    "use strict"
    const Setting = require("../Setting")

    const VersionUpdate = {
        updateUser : function(user) {
            if(user.version != Setting.version) {
                user.version = Setting.version
                user.message = null
                for(let key in user.map) {
                    user.map[key].install = []
                }
            }
        }
    }

    module.exports = VersionUpdate
})()