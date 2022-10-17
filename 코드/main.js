"use strict"
const Presenter = require("Presenter")

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {
    function reply(msg) {
        if([undefined, null, ""].includes(msg)) return ""
        if(!Array.isArray(msg)) {
            replier.reply(msg)
            return ""
        }
        if(Array.isArray(msg[0])) {
            for(m of msg) {
                if(m[1]) {
                    java.lang.Thread.sleep(m[1])
                    replier.reply(m[1] + "time")
                }
                replier.reply(m[0])
            }
        } else {
            for(m of msg) {
                replier.reply(m)
            }
        }
    }

    if(!msg.startsWith("/")) return
    msg = msg.slice(1)
    let hash = 123456
    let result;

    try {
        if(msg == "회원가입") {
            result = Presenter.SignUp(msg, sender, hash)
        } else if(msg == "명령어") {
            result = Presenter.Command(msg, sender, hash)
        } else if(msg == "내정보") {
            result = Presenter.MyInfo(msg, sender, hash)
        } else if(msg == "인벤정보") {
            result = Presenter.InvenInfo(msg, sender, hash)
        } else if(msg == "맵정보") {
            result = Presenter.MapInfo(msg, sender, hash)
        } else if(msg.startsWith("아이템 수집")) {
            result = Presenter.CollectItem(msg, sender, hash)
        } else if(msg.startsWith("아이템 회수")) {
            result = Presenter.RetrieveItem(msg, sender, hash)
        } else if(msg.startsWith("아이템 버림")) {
            result = Presenter.DumpItem(msg, sender, hash)
        }
    } catch(e) {
        console.log(e)
    }

    //reply(result)
    console.log(result)
}