"use strict"
const Presenter = require("./Presenter")
const admin = [123456]

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    function reply(msg, room) {
        if([undefined, null, ""].includes(msg)) return ""
        if(!Array.isArray(msg)) {
            Api.replyRoom(room, msg)
            return ""
        }
        if(Array.isArray(msg[0])) {
            for(m of msg) {
                if(m[1]) {
                    java.lang.Thread.sleep(m[1])
                    Api.replyRoom(room, m[1] + "time")
                }
                Api.replyRoom(room, m[0])
            }
        } else {
            for(m of msg) {
                Api.replyRoom(room, m)
            }
        }
    }

    if(!msg.startsWith("/")) return
    msg = msg.slice(1)
    let hash = 123456
    //let hash = java.lang.String(imageDB.getProfileImage()).hashCode();
    let result;

    try {
        if(admin.includes(hash)) {
            if(msg.startsWith("아이템 가져오기")) {
                result = Presenter.BringItem(msg.slice(9), sender, hash)
            }
        }

        if(msg == "회원가입") {
            result = Presenter.SignUp(msg, sender, hash)
        } else if(msg == "명령어") {
            result = Presenter.Command(msg, sender, hash)
        } else if(msg == "내정보") {
            result = Presenter.MyInfo(msg, sender, hash)
        } else if(msg == "인벤정보") {
            result = Presenter.InvenInfo(msg, sender, hash)
        } else if(msg.startsWith("맵정보")) {
            result = Presenter.MapInfo(msg.slice(4), sender, hash)
        } else if(msg.startsWith("아이템 수집")) {
            result = Presenter.CollectItem(msg.slice(7), sender, hash)
        } else if(msg.startsWith("아이템 회수")) {
            result = Presenter.RetrieveItem(msg.slice(7), sender, hash)
        } else if(msg.startsWith("아이템 버리기")) {
            result = Presenter.DumpItem(msg.slice(8), sender, hash)
        } else if(msg.startsWith("아이템 꺼내기")) {
            result = Presenter.GetItem(msg.slice(8), sender, hash)
        } else if(msg.startsWith("아이템 넣기")) {
            result = Presenter.PutItem(msg.slice(7), sender, hash)
        }
    } catch(e) {
        console.log(e)
    }

    //reply(result, room)
    console.log(result)
}

module.exports = response