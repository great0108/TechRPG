"use strict"
const Setting = require("./Setting")
const View = require("./View")
const CommandHandler = require("./Util/CommandHandler")
const VersionUpdate = require("./Model/VersionUpdate")

VersionUpdate.updateUser()
let bot = new CommandHandler("/", " ", "실험방", Setting.dataSeperator)

/** 메시지를 만드는 기능 */
const MessageCommand = {
    "n" : bot => View.ChooseNum(bot)
}

/** 기본 명령어 */
const Command = {
    "회원가입" : bot => View.SignUp(bot),
    "명령어" : bot => View.Command(bot),
    "내정보" : bot => View.MyInfo(bot),
    "맵정보" : bot => View.MapInfo(bot),
    "아이템 정보" : bot => View.ItemInfo(bot),
    "제작 정보" : bot => View.CraftInfo(bot),
    "탐험" : bot => View.Explore(bot),
    "이동" : bot => View.MoveLocation(bot),
    "아이템 수집" : bot => View.CollectItem(bot),
    "아이템 버리기" : bot => View.DumpItem(bot),
    "아이템 회수" : bot => View.RetrieveItem(bot),
    "아이템 꺼내기" : bot => View.GetItem(bot),
    "아이템 넣기" : bot => View.PutItem(bot),
    "아이템 제작" : bot => View.CraftItem(bot),
    "기구 설치" : bot => View.InstallMachine(bot),
    "기구 회수" : bot => View.RetrieveMachine(bot),
    "글 검색" : bot => View.SearchWriting(bot),
    "글 목록" : bot => View.ListWriting(bot),
    "글 읽기" : bot => View.ReadWriting(bot),
    "글 쓰기" : bot => View.MakeWriting(bot),
    "글 삭제" : bot => View.DeleteWriting(bot),
    "글 추가" : bot => View.AppendWriting(bot)
}

/** 어드민 명령어 */
const AdminCommand = {
    "아이템 가져오기" : bot => View.BringItem(bot),
    "아이템 목록" : bot => View.ListItem(bot),
    "해시 변경" : bot => View.ChangeHash(bot),
    "해시 찾기" : bot => View.FindHash(bot)
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