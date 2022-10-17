(function() {
    "use strict"
    const View = require("./View")
    const UserRepository = require("./Repository/UserRepository")
    const HashDto = require("./Dto/HashDto")
    

    const Presenter = {
        SignUp : function(msg, sender, hash) {
            let hashDto = new HashDto(hash)
            let isExistDto = UserRepository.isExist(hashDto)
            if(isExistDto.isExist) {
                return View.AlreadySignUp()
            }
            return View.SignUp()
        },
        Command : function(msg, sender, hash) {

        },
        MyInfo : function(msg, sender, hash) {

        },
        InvenInfo : function(msg, sender, hash) {

        },
        CollectItem : function(msg, sender, hash) {

        },
        RetrieveItem : function(msg, sender, hash) {

        },
        DumpItem : function(msg, sender, hash) {

        }
    }

    module.exports = Presenter
})()