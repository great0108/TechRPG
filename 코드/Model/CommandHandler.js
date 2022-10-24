module.exports = (function () {
    function CommandHandler() {
      // Init
      this.frontPrefix = "/";
      this.cmdPrefix = " ";
      this.roomPrefix = "";
      this.dataSeparator = " ";
  
      // 메시지 처리
      this.content = "";
      this.cmd = [];
      this.args = [];
      this.data = "";
      this.param = [];
  
      // 사용자
      this.package = "";
      this.room = "";
      this.adminKey = {};
      this.author = {
        name : "",
        nickname : "",
        id : 0
      };
  
      // boolean
      this.isGroupChat = false;
      this.isDebugRoom = false;
      this.isAdmin = false;
      this.isBotOn = false;
    };
  
    CommandHandler.prototype.setInit = function(frontPrefix, cmdPrefix, roomPrefix, dataSeparator) {
      this.frontPrefix = frontPrefix;
      this.cmdPrefix = cmdPrefix;
      this.roomPrefix = roomPrefix;
      this.dataSeparator = dataSeparator;
    };
  
    CommandHandler.prototype.build = function(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
      this.content = msg;
      this.cmd = (msg.startsWith(this.frontPrefix)) ? msg.split(this.cmdPrefix) : [];
      this.cmd[0] = this.cmd[0].replace(/^\//g, "");
      for (let i = 0; i < this.cmd.length; i++) {
        this.cmd[i] = this.cmd[i].replace(/^ +/g, "");
      }
      this.args = this.cmd[this.cmd.length - 1].split(this.dataSeparator);
      this.data = this.args.join(this.dataSeparator);
  
      this.package = packageName;
      this.room = room;
      this.author.name = sender;
      this.author.nickname = sender.match(/[ㄱ-힣a-zA-Z0-9]+/)[0];
      this.author.id = java.lang.String(imageDB.getProfileBase64()).hashCode();
  
      this.isGroupChat = isGroupChat;
      this.isDebugRoom = (packageName === "com.xfl.msgbot");
      this.isBotOn = (this.room.startsWith(this.roomPrefix));
      this.isAdmin = (!this.room in this.adminKey) ? this.adminKey[this.room] === this.author.id : false;
    };
    
    CommandHandler.prototype.run = function(Commands) {
      if (!this.isBotOn) return "";
  
      var cmd = this.cmd;
      var ret = Commands;
      for (let i = 0; i < cmd.length; i++) {
        if (typeof ret === 'function') break;
        for (let j in ret) {
          if (keyToRegex(j).test(cmd[i])) {
            ret = ret[j];
            if (typeof ret === 'undefined') return "";
          }
        }
      }
      if (typeof ret !== "object") return ret(this);
  
      return "";
    };
  
    keyToRegex = (string) => {
      string = string.replace(/n/g, '\\d+') // number
                    .replace(/s/g, '[^\\d ]+') // string
                    .replace(/a/g, '[^ ]+') // any
      return new RegExp("^" + string + "$");
    };
  
    return CommandHandler;
  })();