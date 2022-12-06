(function() {
    "use strict"
    const Inven = require("./Model/Inven")
    const Item = require("./Model/Item")
    const Craft = require("./Model/Craft")
    const UserData = require("./Model/UserData")
    const User = require("./Model/User")
    const Writing = require("./Model/Writing")
    const Err = require("./Util/Err")

    /**
     * 채팅 객체
     * @typedef {object} bot
     * @property {string} frontPrefix
     * @property {string} cmdPrefix
     * @property {string} roomPrefix
     * @property {string} dataSeparator
     * @property {string} content
     * @property {string[]} args
     * @property {string} data
     * @property {string} package
     * @property {string} room
     * @property {string} sender
     * @property {number} hash
     * @property {boolean} isGroupChat
     * @property {boolean} isDebugRoom
     * @property {boolean} isBotOn
     */

    /** 명령어 기능을 하는 모듈 */
    const Presenter = function() {
    }

    /**
     * 회원가입 기능
     * @param {bot} bot 
     */
    Presenter.prototype.SignUp = function(bot) {
        let user = new User(bot.hash)
        if(user.isExist()) {
            Err.AlreadySignUp()
        }

        user.makeUser(bot.sender)
    }

    /**
     * 명령어 기능
     */
    Presenter.prototype.Command = function(bot) {
    },

    /**
     * 내정보 기능
     * @param {bot} bot 
     * @returns { {name : string, location : string, tier : number, busy : boolean, coord : number[], invenInfo : string, invenLimit : number, invenSpace : number} }
     */
    Presenter.prototype.MyInfo = function(bot) {
        let user = new User(bot.hash)
        user.basicCheck()

        let userInfo = user.getBasicInfo()
        let inven = user.getInven()
        let map = user.getMap()

        return {
            name : userInfo.name,
            location : userInfo.location,
            tier : userInfo.tier,
            busy : user.isBusy(),
            coord : map.getLocate(userInfo.location).coord,
            inven : inven.invenInfo(),
            invenSetting : inven.setting,
            invenLimit : inven.invenLimit,
            invenSpace : inven.invenSpace(),
            mapList : map.mapList()
        }
    },

    /**
     * 맵정보 기능
     * @param {bot} bot 
     * @returns { {location : string, coord : number[], biome : string, mapInfo : string} }
     */
    Presenter.prototype.MapInfo = function(bot) {
        let user = new User(bot.hash)
        let location = null
        let map = user.getMap()
        if(bot.args.length === 2) {
            let coord = bot.args.map(v => Number(v)) 
            location = map.getLocateCoord(coord)
        } else {
            location = bot.data || map.location
        }
        user.errorCheck(1)

        if(!map.isExist(location)) {
            return Err.NotExistLocate()
        }

        let locate = map.getLocate(location)
        return {
            location : location,
            coord : locate.coord,
            biome : locate.type,
            items : locate.items,
            dumpItems : locate.dumpItems,
            installs : locate.install,
        }
    }

    /**
     * 아이템 정보 기능
     * @param {bot} bot 
     * @returns { {item : string, itemInfo : string, isCraft : boolean} }
     */
     Presenter.prototype.ItemInfo = function(bot) {
        let user = new User(bot.hash)
        let item = bot.data
        user.basicCheck()

        let itemAllInfo = Item.itemAllInfo(item)
        let craft = new Craft()
        let isCraft = craft.isExist(item)
        return {
            item : item,
            itemAllInfo : itemAllInfo,
            isCraft : isCraft
        }
    }

    /**
     * 제작 정보 기능
     * @param {bot} bot 
     * @returns { {item : string, craftInfo : string} }
     */
    Presenter.prototype.CraftInfo = function(bot) {
        let user = new User(bot.hash)
        let item = bot.data
        user.basicCheck()

        let tier = user.getBasicInfo().tier
        let craft = new Craft()
        let craftNum = craft.getCraftNum(item, tier)
        let craftAllInfo = craft.craftInfos(item, craftNum)
        return {
            item : item,
            craftAllInfo : craftAllInfo
        }
    }

    /**
     * 탐험 기능
     * @param {bot} bot 
     * @returns { {explore : object[], time : number, coord : number[]} }
     */
    Presenter.prototype.Explore = function(bot) {
        let user = new User(bot.hash)
        let coord = bot.args.map(v => Number(v))
        user.errorCheck(1)

        if(isNaN(coord[0]) || isNaN(coord[1])) {
            Err.NotNumber()
        }

        let map = user.getMap()
        let tier = user.getBasicInfo().tier
        let distance = map.distFromHere(coord)
        if(distance > 10 + tier * 5) {
            Err.TooFar()
        }

        let explore = map.explore(coord)
        let time = Math.round(distance * 10) / 10 + explore.length * 3

        let userData = new UserData()
                       .setMap(map.map)
                       .setLocation(map.location)
                       .setBusyTime(Date.now() + time * 1000)
        user.setUser(userData)
        return {
            explore : explore,
            time : time,
            coord : coord
        }
    }

    /**
     * 이동 기능
     * @param {bot} bot 
     * @returns { {time : number, place : string, coord : number[]} }
     */
    Presenter.prototype.MoveLocation = function(bot) {
        let user = new User(bot.hash)
        let coord = null
        let map = user.getMap()
        if(bot.args.length === 1) {
            coord = map.getLocate(bot.data).coord
        } else {
            coord = bot.args.map(v => Number(v))
        }
        user.errorCheck(1)

        if(isNaN(coord[0]) || isNaN(coord[1])) {
            Err.NotNumber()
        }
        
        let tier = user.getBasicInfo().tier
        let distance = map.distFromHere(coord)
        if(distance > 10 + tier * 5) {
            Err.TooFar()
        }

        let place = map.move(coord)
        let time = Math.round(distance * 10) / 10

        let userData = new UserData()
                       .setLocation(map.location)
                       .setBusyTime(Date.now() + time * 1000)
        user.setUser(userData)
        return {
           time : time,
           place : place,
           coord : coord
        }
    }

    /**
     * 아이템 수집 기능
     * @param {bot} bot 
     * @returns { {item : string, number : number, time : number, tool : string|null, withItem : string|undefined} }
     */
    Presenter.prototype.CollectItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, withItem] = bot.args
        number = Number(number)
        user.errorCheck(number)

        let userInfo = user.getBasicInfo()
        if(number > userInfo.tier * 5 + 10) {
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

    /**
     * 아이템 버리기 기능
     * @param {bot} bot 
     * @returns { {item : string, number : number, withItem : string|undefined} }
     */
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

    /**
     * 아이템 회수 기능
     * @param {bot} bot 
     * @returns { {item : string, number : number, withItem : string|undefined} }
     */
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

    /**
     * 아이템 꺼내기 기능
     * @param {bot} bot 
     * @returns { {item : string, number : number, store : string, withItem : string|undefined} }
     */
    Presenter.prototype.GetItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, store, withItem] = bot.args
        number = Number(number)

        user.errorCheck(number)
        if(store === withItem) {
            Err.CommandError()
        }

        let inven = user.getInven()
        let map = user.getMap()
        let install = map.getInstall()
        let storeInven = inven.itemInven(store)
        let isInstall = false

        if(storeInven === false) {
            storeInven = install.itemInven(store)
            isInstall = true
            if(storeInven === false) {
                Err.CantFindStore()
            }
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

        if(!isInstall) {
            inven.findItem(store).meta.inven = storeInven2.inven
        } else {
            install.findItem(store).meta.inven = storeInven2.inven
            map.setInstall(install)
        }
           
        let userData = new UserData()
                        .setInven(inven.inven)
                        .setMap(map.map)

        user.setUser(userData)
        return {
            item : item,
            number : number,
            store : store,
            withItem : withItem
        }
    }

    /**
     * 아이템 꺼내기 기능
     * @param {bot} bot 
     * @returns { {item : string, number : number, store : string, withItem : string|undefined} }
     */
    Presenter.prototype.PutItem = function(bot) {
        let user = new User(bot.hash)
        let [item, number, store, withItem] = bot.args
        number = Number(number)

        user.errorCheck(number)
        if(store === withItem) {
            Err.CommandError()
        }

        let inven = user.getInven()
        let map = user.getMap()
        let install = map.getInstall()
        let storeInven = inven.itemInven(store)
        let isInstall = false

        if(storeInven === false) {
            storeInven = install.itemInven(store)
            isInstall = true
            if(storeInven === false) {
                Err.CantFindStore()
            }
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

        if(!isInstall) {
            inven.findItem(store).meta.inven = storeInven2.inven
        } else {
            install.findItem(store).meta.inven = storeInven2.inven
            map.setInstall(install)
        }

        let userData = new UserData()
                        .setInven(inven.inven)
                        .setMap(map.map)

        user.setUser(userData)
        return {
            item : item,
            number : number,
            store : store,
            withItem : withItem
        }
    }

    /**
     * 아이템 제작 기능
     * @param {bot} bot 
     * @returns { {craftInfo : string|undefined, item : string|undefined, number : number|undefined,
     *             time : number|undefined, need : string|undefined, useItems : array[]|undefined} }
     */
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
        if(number > tier * 5 + 10) {
            Err.OutOfRangeNumber()
        }

        if(craftNum) {
            if(isNaN(craftNum)) {
                Err.NotNumber()
            } else if (craftNumber < craftNum || craftNum <= 0) {
                Err.OutOfRangeCraftNum()
            }
        } else {
            if (craftNumber > 1) {
                let craftInfo = craft.craftInfos(item, craftNumber)

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
                        .setBusyTime(Date.now() + number * craftInfo.time * 1000)

        user.setUser(userData)
        return {
            item : item,
            number : number * craftInfo.number,
            time : number * craftInfo.time,
            need : craftInfo.need,
            useItems : useItems
        }
    }

    /**
     * 기구 설치 기능
     * @param {bot} bot
     * @return { {item : string, number : number} }
     */
    Presenter.prototype.InstallMachine = function(bot) {
        let user = new User(bot.hash)
        let [item, number] = bot.args
        number = number || 1
        number = Number(number)
        user.errorCheck(number)

        let inven = user.getInven()
        let map = user.getMap()
        let install = map.getInstall()

        let itemInfo = Item.getBasicInfo(item)
        if(!["store", "use"].includes(itemInfo.type)) {
            Err.CantInstallItem()
        }

        let [inven2] = inven.getItems([item], [number])
        if(inven2 === false) {
            Err.NotExistItem()
        }

        install = install.putItems([item], [number])
        map.setInstall(install)

        let userData = new UserData()
                        .setInven(inven2.inven)
                        .setMap(map.map)

        user.setUser(userData)
        return {
            item : item,
            number : number
        }
    }

    /**
     * 기구 회수 기능
     * @param {bot} bot 
     * @returns { {item : string, number : number, time : number, tool : string|null} }
     */
    Presenter.prototype.RetrieveMachine = function(bot) {
        let user = new User(bot.hash)
        let [item, number] = bot.args
        number = number || 1
        number = Number(number)
        user.errorCheck(number)

        let inven = user.getInven()
        let map = user.getMap()
        let install = map.getInstall()

        let [install2, retrieveItems] = install.getItems([item], [number])
        if(install2 === false) {
            Err.CantFindInstall()
        }

        let itemName = retrieveItems[0].name
        let collectInfo = Item.getCollectInfo(itemName)
        let tools = inven.findTool(collectInfo.effective)
        let tool = tools.find(v => v.meta.tier >= collectInfo.tier && v.meta.durability >= number)
        if(!tool && collectInfo.tier >= number) {
            Err.CantCollectItem()
        }
        
        let inven2 = null
        let time = collectInfo.collectTime * number / (tool ? tool.meta.speed : 1)
        if(!tool) {
            inven2 = inven.putItems([itemName], [number])
        } else if(tool.meta.durability === number) {
            let [tempInven] = inven.getItems([tool.nick], [number])
            inven2 = tempInven.putItems([itemName], [number])
        } else {
            inven.findItem(tool.nick).meta.durability -= number
            inven2 = inven.putItems([itemName], [number])
        }

        for(let retrieveItem of retrieveItems) {
            if(retrieveItem.type === "store") {
                let [names, numbers, metas] = Inven.splitItemInfo(retrieveItem.meta.inven)
                let dumpInven = map.dumpItems(names, numbers, metas)
                map.setDumpItems(dumpInven)
            }
        }

        if(inven2 === false) {
            Err.LackInvenSpace()
        }
        map.setInstall(install2)

        let userData = new UserData()
                        .setInven(inven2.inven)
                        .setMap(map.map)
                        .setBusyTime(Date.now() + time * 1000)

        user.setUser(userData)
        return {
            item : item,
            tool : tool ? tool.nick : null,
            time : time,
            number : number
        }
    }

    /**
     * 글 검색 기능
     * @param {bot} bot 
     * @returns { {word : string, list : string[]} }
     */
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

    /**
     * 글 목록 기능
     * @param {bot} bot 
     * @returns { {list : string[]} }
     */
    Presenter.prototype.ListWriting = function(bot) {
        let user = new User(bot.hash)
        user.basicCheck()

        let list = Writing.list()
        return {
            list : list
        }
    }

    /**
     * 글 읽기 기능
     * @param {bot} bot 
     * @returns { {title : string, text : string} }
     */
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

    /**
     * 글 쓰기 기능
     * @param {bot} bot 
     * @returns { {title : string, text : string} }
     */
    Presenter.prototype.MakeWriting = function(bot) {
        let user = new User(bot.hash)
        let index = bot.data.indexOf("\n")
        user.basicCheck()

        if(index === -1) {
            Err.NotText()
        }

        let title = bot.data.slice(0, index)
        let text = bot.data.slice(index+1)
        if(Writing.isExist(title)) {
            Err.AlreadyExistWriting()
        }

        Writing.write(title, text)
        return {
            title : title,
            text : text
        }
    }

    /**
     * 글 삭제 기능
     * @param {bot} bot 
     * @returns { {title : string, text : string} }
     */
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

    /**
     * 글 추가 기능
     * @param {bot} bot 
     * @returns { {title : string, text : string} }
     */
    Presenter.prototype.AppendWriting = function(bot) {
        let user = new User(bot.hash)
        let index = bot.data.indexOf("\n")
        user.basicCheck()

        if(index === -1) {
            Err.NotText()
        }

        let title = bot.data.slice(0, index)
        let text = bot.data.slice(index+1)
        if(!Writing.isExist(title)) {
            Err.NotExistWriting()
        }

        text = Writing.append(title, text)
        return {
            title : title,
            text : text
        }
    }

    /**
     * 선택에 맞게 메시지를 만드는 기능
     * @param {bot} bot 
     * @returns { {message : string} }
     */
    Presenter.prototype.ChooseNum = function(bot) {
        let user = new User(bot.hash)
        let number = Number(bot.content)
        if(isNaN(number)) {
            return
        } else if(!user.isExist()) {
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

    /**
     * 아이템 가져오기 기능
     * @param {bot} bot 
     * @returns { {item : string, number : number, withItem : string|undefined} }
     */
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

    /**
     * 아이템 목록 기능
     * @param {bot} bot 
     * @returns { {list : string[]} }
     */
    Presenter.prototype.ListItem = function(bot) {
        let user = new User(bot.hash)
        user.basicCheck()

        let list = Item.getList()
        return {
            list : list
        }
    }

    Presenter.prototype.ChangeHash = function(bot) {
        let [hash1, hash2, name] = bot.args
        let user = new User(hash1)
        user.basicCheck()

        let userData = user.deleteUser()
        let user2 = new User(hash2)
        
        userData.name = name || userData.name
        user2.makeUser(userData.name)
        user2.setUser(userData)

        return {
            hash1 : hash1,
            hash2 : hash2
        }
    }

    Presenter.prototype.FindHash = function(bot) {
        let user = new User(bot.hash)
        let [name] = bot.args
        user.basicCheck()

        let userList = user.findUser(name)
        return {
            name : name,
            userInfo : userList.map(hash => {
                let info = this.MyInfo({hash : hash})
                info.hash = hash
                return info
            })
        }
    }

    module.exports = Presenter
})()