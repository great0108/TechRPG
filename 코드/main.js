"use strict"
const Setting = require("./Setting")
const View = require("./View")
const CommandHandler = require("./Util/CommandHandler")
const UserDao = require("./Dao/UserDao")

UserDao.update()
let bot = new CommandHandler("/", " ", "실험방", Setting.dataSeperator)
const MessageCommand = {
    "n" : bot => View.ChooseNum(bot)
}

const Command = {
    "회원가입" : bot => View.SignUp(bot),
    "명령어" : bot => View.Command(bot),
    "내정보" : bot => View.MyInfo(bot),
    "인벤정보" : bot => View.InvenInfo(bot),
    "맵정보" : bot => View.MapInfo(bot),
    "아이템 수집" : bot => View.CollectItem(bot),
    "아이템 회수" : bot => View.RetrieveItem(bot),
    "아이템 버리기" : bot => View.DumpItem(bot),
    "아이템 꺼내기" : bot => View.GetItem(bot),
    "아이템 넣기" : bot => View.PutItem(bot),
    "아이템 제작" : bot => View.CraftItem(bot),
    "아이템 정보" : bot => View.ItemInfo(bot),
    "제작 정보" : bot => View.CraftInfo(bot),
    "튜토리얼" : bot => View.Tutorial(bot)
}

const AdminCommand = {
    "아이템 가져오기" : bot => View.BringItem(bot)
}

function response(admin, room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    function reply(msg, room) {
        if(msg === "") return ""
        if(!Array.isArray(msg)) {
            Api.replyRoom(room, msg)
            return ""
        }
        if(Array.isArray(msg[0])) {
            for(let m of msg) {
                if(m[1]) {
                    java.lang.Thread.sleep(m[1])
                }
                Api.replyRoom(room, m[0])
            }
        } else {
            for(let m of msg) {
                Api.replyRoom(room, m)
            }
        }
    }

    bot.build(room, msg, sender, isGroupChat, replier, imageDB, packageName);
    let result;
    try {
        let message = bot.run(MessageCommand)
        if(message) {
            bot.build(room, bot.frontPrefix + message, sender, isGroupChat, replier, imageDB, packageName);
        }

        if(admin.includes(bot.hash)) {
            result = bot.run(AdminCommand)
        }
        if(!result) {
            result = bot.run(Command)
        }
    } catch(e) {
        result = e
    }

    if(Setting.nodeJS) {
        console.log(result)
    } else {
        reply(result, room)
    }
}

module.exports = response