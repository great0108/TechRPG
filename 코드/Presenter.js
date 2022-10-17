(function() {
    "use strict"
    const View = require("./View")
    const UserHandler = require("./Model/UserHandler")
    const UserRepository = require("./Repository/UserRepository")
    const SenderDto = require("./Dto/SenderDto")
    

    const Presenter = {
        SignUp : function(msg, sender, hash) {
            let user = new UserHandler(hash)
            if(user.isExist) {
                return View.AlreadySignUp()
            }

            let senderDto = new SenderDto(sender, hash)
            UserRepository.newUser(senderDto)
            return View.SignUp()
        },
        Command : function(msg, sender, hash) {
            return View.Command()
        },
        MyInfo : function(msg, sender, hash) {
            let user = new UserHandler(hash)
            if(user.isExist) {
                return View.NotSignUp()
            }

            let userDto = UserRepository.getUser()
            return View.MyInfo(userDto)
        },
        InvenInfo : function(msg, sender, hash) {
            let user = new UserHandler(hash)
            if(user.isExist) {
                return View.NotSignUp()
            }
        },
        MapInfo : function(msg, sender, hash) {

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