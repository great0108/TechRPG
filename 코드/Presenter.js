(function() {
    "use strict"
    const Inven = require("./Model/Inven")
    const Item = require("./Model/Item")
    const Craft = require("./Model/Craft")
    const UserData = require("./Model/UserData")
    const User = require("./Model/User")
    const Writing = require("./Model/Writing")
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
        user.basicCheck()

        let userInfo = user.getBasicInfo()
        let map = user.getMap()

        return {
            name : userInfo.name,
            location : userInfo.location,
            tier : userInfo.tier,
            busy : user.isBusy(),
            coord : map.getLocate(userInfo.location).coord
        }
    },
    Presenter.prototype.InvenInfo = function(bot) {
        let user = new User(bot.hash)
        user.basicCheck()

        let inven = user.getInven()
        return {
            invenInfo : inven.invenInfo(),
            invenLimit : inven.invenLimit,
            invenSpace : inven.invenSpace()
        }
    }
    Presenter.prototype.MapInfo = function(bot) {
        let user = new User(bot.hash)
        user.basicCheck()

        let map = user.getMap()
        let location = bot.data || map.location
        if(!map.isExist(location)) {
            return Err.NotExistMap()
        }

        let locate = map.getLocate(location)
        return {
            location : location,
            coord : locate.coord,
            biome : locate.type,
            mapInfo : map.mapInfo(location),
        }
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
        return {
            item : item,
            number : number,
            time : time,
            tool : tool ? tool.nick : null,
            withItem : withItem
        }
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
        return {
            item : item,
            number : number,
            withItem : withItem
        }
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
        return {
            item : item,
            number : number,
            withItem : withItem
        }
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
        return {
            item : item,
            number : number,
            store : store,
            withItem : withItem
        }
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
        return {
            item : item,
            number : number,
            store : store,
            withItem : withItem
        }
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
                let craftInfo = craft.craftInfos(craftNumber)

                let userData = new UserData()
                                .setMessage(bot.content)

                user.setUser(userData)
                return {
                    craftInfo : craftInfo
                }
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
        return {
            item : item,
            number : number * craftInfo.number,
            time : number * craftInfo.time,
            need : craftInfo.need,
            useItems : useItems
        }
    }
    Presenter.prototype.ItemInfo = function(bot) {
        let user = new User(bot.hash)
        let item = bot.data
        user.basicCheck()

        let itemInfo = Item.itemInfo(item)
        return {
            item : item,
            itemInfo : itemInfo
        }
    }
    Presenter.prototype.CraftInfo = function(bot) {
        let user = new User(bot.hash)
        let item = bot.data
        user.basicCheck()

        let tier = user.getBasicInfo().tier
        let craft = new Craft()
        let craftNum = craft.getCraftNum(item, tier)
        let craftInfo = craft.craftInfos(item, craftNum)
        return {
            item : item,
            craftInfo : craftInfo
        }
    }
    Presenter.prototype.SearchWriting = function(bot) {
        let user = new User(bot.hash)
        let word = bot.data
        user.basicCheck()

        let list = Writing.search(word)
        return {
            word : word,
            list : list
        }
    }
    Presenter.prototype.ListWriting = function(bot) {
        let user = new User(bot.hash)
        user.basicCheck()

        let list = Writing.list()
        return {
            list : list
        }
    }
    Presenter.prototype.ReadWriting = function(bot) {
        let user = new User(bot.hash)
        let title = bot.data
        user.basicCheck()

        let text = Writing.read(title)
        return {
            title : title,
            text : text
        }
    }
    Presenter.prototype.MakeWriting = function(bot) {
        let user = new User(bot.hash)
        let index = bot.data.indexOf("\n")
        user.basicCheck()

        if(index === -1) {
            Err.NotText()
        }

        let title = bot.data.slice(index)
        let text = bot.data.slice(index+1, bot.data.length)
        if(Writing.isExist(title)) {
            Err.AlreadyExistWriting()
        }

        Writing.write(title, text)
        return {
            title : title,
            text : text
        }
    }
    Presenter.prototype.DeleteWriting = function(bot) {
        let user = new User(bot.hash)
        let title = bot.data
        user.basicCheck()

        if(!Writing.isExist(title)) {
            Err.NotExistWriting()
        }

        let text = Writing.read(title)
        Writing.delete(title)
        return {
            title : title,
            text : text
        }
    }
    Presenter.prototype.AppendWriting = function(bot) {
        let user = new User(bot.hash)
        let index = bot.data.indexOf("\n")
        user.basicCheck()

        if(index === -1) {
            Err.NotText()
        }

        let title = bot.data.slice(index)
        let text = bot.data.slice(index+1, bot.data.length)
        if(!Writing.isExist(title)) {
            Err.NotExistWriting()
        }

        text = Writing.append(title, text)
        return {
            title : title,
            text : text
        }
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
        return {
            message : message + "/" + number
        }
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
        return {
            item : item,
            number : number,
            withItem : withItem
        }
    }
    Presenter.prototype.ListItem = function(bot) {
        let user = new User(bot.hash)
        user.basicCheck()

        let list = Item.getList()
        return {
            list : list
        }
    }

    module.exports = Presenter
})()