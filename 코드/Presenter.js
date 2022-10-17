(function() {
    "use strict"
    const View = require("./View")
    const UserRepository = require("./Repository/UserRepository")
    const HashDto = require("./Dto/HashDto")
    const SenderDto = require("./Dto/SenderDto")
    const UserDto = require("./Dto/UserDto")
    

    const Presenter = {
        SignUp : function(msg, sender, hash) {
            let hashDto = new HashDto(hash)
            let isExistDto = UserRepository.isExist(hashDto)
            if(isExistDto.isExist) {
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
            let hashDto = new HashDto(hash)
            let isExistDto = UserRepository.isExist(hashDto)
            if(!isExistDto.isExist) {
                return View.NotSignUp()
            }

            let userDto = UserRepository.getUser()
            return View.MyInfo(userDto)
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