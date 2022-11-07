(function() {
    "use strict"
    const Inven = require("./Model/Inven")
    const Item = require("./Model/Item")
    const Craft = require("./Model/Craft")
    const UserData = require("./Model/UserData")
    const User = require("./Model/User")
    const Err = require("./Util/Err")

    const Presenter = function() {
    }
    Presenter.prototype.SignUp = function(bot) {
        let user = new User(bot.hash)
        if(user.isExist()) {
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
        } else if(user.getMessage()) {
            user.setUser(new UserData().setMessage(null))
            Err.CancleCommand()
        }

        let userInfo = user.getBasicInfo()
        let map = user.getMap()

        this.name = userInfo.name
        this.location = userInfo.location
        this.tier = userInfo.tier
        this.busy = user.isBusy()
        this.coord = map.getLocate(userInfo.location).coord
    },
    Presenter.prototype.InvenInfo = function(bot) {
        let user = new User(bot.hash)
        if(!user.isExist()) {
            Err.NotSignUp()
        } else if(user.getMessage()) {
            user.setUser(new UserData().setMessage(null))
            Err.CancleCommand()
        }

        let inven = user.getInven()
        this.invenInfo = inven.invenInfo()
        this.invenLimit = inven.invenLimit
        this.invenSpace = inven.invenSpace()
    }
    Presenter.prototype.MapInfo = function(bot) {
        let user = new User(bot.hash)
        if(!user.isExist()) {
            Err.NotSignUp()
        } else if(user.getMessage()) {
            user.setUser(new UserData().setMessage(null))
            Err.CancleCommand()
        }

        let map = user.getMap()
        let location = bot.data || map.location
        if(!map.isExist(location)) {
            return Err.NotExistMap()
        }

        let locate = map.getLocate(location)
        this.location = location
        this.coord = locate.coord
        this.biome = locate.type
        this.mapInfo = map.mapInfo(location)
    }
    Presenter.prototype.CollectItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, withItem] = bot.args
        number = Number(number)
        user.errorCheck(number)

        let userInfo = user.getBasicInfo()
        if(number > userInfo.tier * 10 + 10) {
            Err.OutOfRangeNumber()
        }

        let inven = user.getInven()
        let map = user.getMap()

        let itemInven = withItem ? inven.itemInven(withItem) : null
        if(itemInven === false) {
            Err.NotHaveItem()
        }

        let [mapInven] = map.getItems([item], [number])
        if(mapInven === false) {
            Err.LackMapItem()
        }
        
        let collectInfo = Item.getCollectInfo(item)
        let tools = inven.findTool(collectInfo.effective)
        let tool = tools.find(v => v.meta.tier >= collectInfo.tier && v.meta.durability >= number)
        if(!tool && collectInfo.tier >= 1) {
            Err.CantCollectItem()
        }
        
        let time = collectInfo.collectTime * number / (tool ? tool.meta.speed : 1)
        let inven2 = null
        if(!tool) {
            inven2 = (withItem ? itemInven : inven).putItems([item], [number])
        } else if(tool.meta.durability === number) {
            let [tempInven] = inven.getItems([tool.nick], [1])
            inven2 = (withItem ? itemInven : tempInven).putItems([item], [number])
        } else {
            inven.findItem(tool.nick).meta.durability -= number
            inven2 = (withItem ? itemInven : inven).putItems([item], [number])
        }

        if(inven2 === false) {
            Err.LackInvenSpace()
        }

        map.setItems(mapInven)
        if(withItem) {
            inven.findItem(withItem).meta.inven = inven2.inven
        } else {
            inven.inven = inven2.inven
        }

        let userData = new UserData()
                        .setInven(inven.inven)
                        .setMap(map.map)
                        .setBusyTime(Date.now() + time*1000)

        user.setUser(userData)
        this.item = item
        this.number = number
        this.time = time
        this.tool = tool ? tool.nick : null
        this.withItem = withItem
    }
    Presenter.prototype.DumpItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, withItem] = bot.args
        number = Number(number)
        user.errorCheck(number)

        let inven = user.getInven()
        let map = user.getMap()
        let itemInven = withItem ? inven.itemInven(withItem) : null
        if(itemInven === false) {
            Err.NotHaveItem()
        }

        let [inven2, outItems] = (withItem ? itemInven : inven).getItems([item], [number])
        if(inven2 === false) {
            Err.LackInvenItem()
        }

        let [names, numbers, metas] = Inven.splitItemInfo(outItems)
        let dumpItems = map.dumpItems(names, numbers, metas)
        map.setDumpItems(dumpItems)

        if(withItem) {
            inven.findItem(withItem).meta.inven = inven2.inven
        } else {
            inven.inven = inven2.inven
        }

        let userData = new UserData()
                        .setInven(inven.inven)
                        .setMap(map.map)

        user.setUser(userData)
        this.item = item
        this.number = number
        this.withItem = withItem
    }
    Presenter.prototype.RetrieveItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, withItem] = bot.args
        number = Number(number)
        user.errorCheck(number)

        let inven = user.getInven()
        let map = user.getMap()
        let itemInven = withItem ? inven.itemInven(withItem) : null
        if(itemInven === false) {
            Err.NotHaveItem()
        }

        let [mapInven, outItems] = map.retrieveItems([item], [number])
        if(mapInven === false) {
            Err.LackMapItem()
        }

        let [names, numbers, metas] = Inven.splitItemInfo(outItems)
        let inven2 = (withItem ? itemInven : inven).putItems(names, numbers, metas)
        if(inven2 === false) {
            Err.LackInvenSpace()
        }

        map.setDumpItems(mapInven)
        if(withItem) {
            inven.findItem(withItem).meta.inven = inven2.inven
        } else {
            inven.inven = inven2.inven
        }

        let userData = new UserData()
                        .setInven(inven.inven)
                        .setMap(map.map)

        user.setUser(userData)
        this.item = item
        this.number = number
        this.withItem = withItem
    }
    Presenter.prototype.GetItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, store, withItem] = bot.args
        number = Number(number)

        user.errorCheck(number)
        if(store === withItem) {
            Err.CommandError()
        }

        let inven = user.getInven()
        let storeInven = inven.itemInven(store)
        if(storeInven === false) {
            Err.CantFindStore()
        }

        let itemInven = withItem ? inven.itemInven(withItem) : null
        if(itemInven === false) {
            Err.NotHaveItem()
        }

        let [storeInven2, outItems] = storeInven.getItems([item], [number])
        if(storeInven2 === false) {
            Err.LackInvenItem()
        }

        let [names, numbers, metas] = Inven.splitItemInfo(outItems)
        let inven2 = (withItem ? itemInven : inven).putItems(names, numbers, metas)
        if(inven2 === false) {
            Err.LackInvenSpace()
        }

        if(withItem) {
            inven.findItem(withItem).meta.inven = inven2.inven
        } else {
            inven.inven = inven2.inven
        }
        inven.findItem(store).meta.inven = storeInven2.inven
           

        let userData = new UserData()
                        .setInven(inven.inven)

        user.setUser(userData)
        this.item = item
        this.number = number
        this.store = store
        this.withItem = withItem
    }
    Presenter.prototype.PutItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, store, withItem] = bot.args
        number = Number(number)

        user.errorCheck(number)
        if(store === withItem) {
            Err.CommandError()
        }

        let inven = user.getInven()
        let storeInven = inven.itemInven(store)
        if(storeInven === false) {
            Err.CantFindStore()
        }

        let itemInven = withItem ? inven.itemInven(withItem) : null
        if(itemInven === false) {
            Err.NotHaveItem()
        }

        let [inven2, outItems] = (withItem ? itemInven : inven).getItems([item], [number])
        if(inven2 === false) {
            Err.LackInvenItem()
        }

        let [names, numbers, metas] = Inven.splitItemInfo(outItems)
        let storeInven2 = storeInven.putItems(names, numbers, metas)
        if(storeInven2 === false) {
            Err.LackInvenSpace()
        }   

        if(withItem) {
            inven.findItem(withItem).meta.inven = inven2.inven
        } else {
            inven.inven = inven2.inven
        }
        inven.findItem(store).meta.inven = storeInven2.inven
           

        let userData = new UserData()
                        .setInven(inven.inven)

        user.setUser(userData)
        this.item = item
        this.number = number
        this.store = store
        this.withItem = withItem
    },
    Presenter.prototype.CraftItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, craftNum] = bot.args
        number = Number(number)
        user.errorCheck(number)

        let inven = user.getInven()
        let map = user.getMap()
        let craft = new Craft(inven)

        let tier = user.getBasicInfo().tier
        let craftNumber = craft.getCraftNum(item, tier)

        if(craftNum) {
            if(isNaN(craftNum)) {
                Err.NotNumber()
            } else if (craftNumber < craftNum || craftNum <= 0) {
                Err.OutOfRangeCraftNum()
            }
        } else {
            if (craftNumber > 1) {
                let craftInfo = []
                for(let i = 0; i < craftNumber; i++) {
                    craftInfo.push(craft.craftInfo(item, i+1))
                }

                let userData = new UserData()
                                .setMessage(bot.content)

                user.setUser(userData)
                this.craftInfo = craftInfo
                return
            } else {
                craftNum = 1
            }
        }

        let craftInfo = craft.getBasicInfo(item, craftNum)
        let install = map.getInstall()
        if(craftInfo.need && !install.findItem(craftInfo.need)) {
            Err.CantFindInstall()
        }

        let [inven2, useItems] = craft.craft(item, number, craftNum)
        if(inven2 === "tool") {
            Err.LackInvenTool()
        } else if(inven2 === "inven") {
            Err.LackInvenItem()
        } else if(inven2 === "space") {
            Err.LackInvenSpace()
        }

        let userData = new UserData()
                        .setInven(inven2.inven)

        user.setUser(userData)
        this.item = item
        this.number = number * craftInfo.number
        this.time = number * craftInfo.time
        this.need = craftInfo.need
        this.useItems = useItems
    }
    Presenter.prototype.ItemInfo = function(bot) {
        let user = new User(bot.hash)
        let item = bot.data
        user.errorCheck(1)


    }
    Presenter.prototype.CraftInfo = function(bot) {

    }
    Presenter.prototype.Tutorial = function(bot) {

    }
    Presenter.prototype.ChooseNum = function(bot) {
        let user = new User(bot.hash)
        let number = Number(bot.content)
        if(!user.isExist()) {
            return
        }
        
        let message = user.getMessage()
        if(!message) {
            return
        }

        let userData = new UserData()
                        .setMessage(null)
        user.setUser(userData)
        this.message = message + "/" + number
    }
    Presenter.prototype.BringItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, withItem] = bot.args
        number = Number(number)
        user.errorCheck(number)

        let inven = user.getInven()
        let itemInven = withItem ? inven.itemInven(withItem) : null
        if(itemInven === false) {
            Err.NotHaveItem()
        }

        let inven2 = (withItem ? itemInven : inven).putItems([item], [number])
        if(inven2 === false) {
            Err.LackInvenSpace()
        }

        if(withItem) {
            inven.findItem(withItem).meta.inven = inven2.inven
        } else {
            inven.inven = inven2.inven
        }

        let userData = new UserData()
                        .setInven(inven.inven)

        user.setUser(userData)
        this.item = item
        this.number = number
        this.withItem = withItem
    }

    module.exports = Presenter
})()