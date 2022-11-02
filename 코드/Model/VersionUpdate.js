(function() {
    "use strict"
    const Setting = require("../Setting")

    const VersionUpdate = {
        updateUser : function(user) {
            if(user.version != Setting.version) {
                user.version = Setting.version
            }
        }
    }

    module.exports = VersionUpdate
})()