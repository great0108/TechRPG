(function() {
    "use strict"
    const UserMaker = require("./Model/UserMaker")
    const Inven = require("./Model/Inven")
    const Map = require("./Model/Map")
    const Craft = require("./Model/Craft")
    const UserData = require("./Model/UserData")
    const User = require("./Model/User")
    const Err = require("./Util/Err")

    const Presenter = function(view) {
        this.view = view
    }
    Presenter.prototype.SignUp = function(bot) {
        let user = new User(bot.hash)
        if(!user.isExist()) {
            Err.AlreadySignUp()
        }

        user.makeUser(bot.sender)
    }
    Presenter.prototype.Command = function(bot) {
    },
    Presenter.prototype.MyInfo = function(bot) {
        let user = new User(bot.hash)
        if(!user.isExist()) {
            Err.NotSignUp()
        }

        let userInfo = user.getBasicInfo()
        let map = user.getMap()

        this.name = userInfo.name
        this.location = userInfo.location
        this.tier = userInfo.tier
        this.busy = user.isBusy()
        this.coord = map.getLocate(userInfo.location).coord
        this.view.update()
    },
    Presenter.prototype.InvenInfo = function(bot) {
        let user = new User(bot.hash)
        if(!user.isExist()) {
            Err.NotSignUp()
        }

        let inven = user.getInven()
        this.invenInfo = inven.invenInfo()
        this.invenLimit = inven.invenLimit
        this.invenSpace = inven.invenSpace()
        this.view.update()
    }
    
})()