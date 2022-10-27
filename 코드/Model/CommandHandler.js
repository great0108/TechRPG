(function() {
    "use strict"
    const Setting = require("../Setting")

    const CommandHandler = function(frontPrefix, cmdPrefix, roomPrefix, dataSeparator) {
        this.frontPrefix = frontPrefix;
        this.cmdPrefix = cmdPrefix;
        this.roomPrefix = roomPrefix;
        this.dataSeparator = dataSeparator;
  
        // 메시지 처리
        this.content = "";
        this.cmd = [];
        this.args = [];
        this.data = "";
        this.param = [];
  
        // 사용자
        this.package = "";
        this.room = "";
        this.sender = ""
        this.nickname = ""
        this.hash = ""
  
        // boolean
        this.isGroupChat = false;
        this.isDebugRoom = false;
        this.isBotOn = false;
    }
    CommandHandler.prototype.build = function(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
        this.content = msg.slice(this.frontPrefix.length);
        this.package = packageName;
        this.room = room;
        this.sender = sender
        this.hash = Setting.nodeJS ? 123456 : imageDB.getProfileHash()
    
        this.isGroupChat = isGroupChat;
        this.isDebugRoom = (packageName === "com.xfl.msgbot")
        this.isBotOn = this.room.startsWith(this.roomPrefix) && msg.startsWith(this.frontPrefix)
    };
    CommandHandler.prototype.run = function(Commands) {
        if (!this.isBotOn) return "";
    
        var cmd = this.content
        for (let key in Commands) {
            let a = this.keyToRegex(key)
            if (a.test(cmd)) {
                let match = cmd.match(a)[0]
                this.data = cmd.slice(match.length).trim()
                this.args = this.data.split(this.dataSeparator)
                return Commands[key](this)
            }
        }
        return "";
    };
    CommandHandler.prototype.keyToRegex = function(string) {
        string = string.replace(/n/g, '\\d+') // number
                      .replace(/s/g, '[^\\d ]+') // string
                      .replace(/a/g, '[^ ]+') // any
        return new RegExp(string);
    }

    module.exports = CommandHandler
})()