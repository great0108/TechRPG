"use strict"
const Setting = require("./Setting")
const Presenter = require("./Presenter")
const CommandHandler = require("./Model/CommandHandler")

let bot = new CommandHandler("/", " ", "실험방", "/")
const Command = {
    "회원가입" : bot => Presenter.SignUp(bot),
    "명령어" : bot => Presenter.Command(bot),
    "내정보" : bot => Presenter.MyInfo(bot),
    "인벤정보" : bot => Presenter.InvenInfo(bot),
    "맵정보" : bot => Presenter.MapInfo(bot),
    "아이템 수집" : bot => Presenter.CollectItem(bot),
    "아이템 회수" : bot => Presenter.RetrieveItem(bot),
    "아이템 버리기" : bot => Presenter.DumpItem(bot),
    "아이템 꺼내기" : bot => Presenter.GetItem(bot),
    "아이템 넣기" : bot => Presenter.PutItem(bot),
    "아이템 제작" : bot => Presenter.CraftItem(bot)
}

const AdminCommand = {
    "아이템 가져오기" : bot => Presenter.BringItem(bot)
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