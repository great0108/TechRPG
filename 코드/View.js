(function() {
    "use strict"
    const Setting = require("./Setting")
    const Space = Setting.nodeJS ? "" : '\u200b'.repeat(500)
    const Presenter = require("./Presenter")

    const View = {
        update : function() {

        },
        Command : function(bot) {
            let presenter = new Presenter()
            presenter.Command(bot)
            return "명령어 목록입니다\n" + Space + 
            "회원가입 - 회원가입을 합니다\n" + 
            "명령어 - 명령어 목록을 보여줍니다\n" +
            "내정보 - 내 정보를 보여줍니다\n" +
            "인벤정보 - 인벤 정보를 보여줍니다\n" +
            "맵정보 [위치] - 맵 정보를 보여줍니다\n" +
            "아이템 수집 (아이템)/(개수)/[to item] - 아이템을 수집합니다\n" +
            "아이템 회수 (아이템)/(개수)/[to item] - 버린 아이템을 수집합니다\n" +
            "아이템 버리기 (아이템)/(개수)/[in 아이템] - 아이템을 버립니다\n" +
            "아이템 꺼내기 (아이템)/(개수)/(in 아이템)/[to item] - 저장공간에서 아이템을 꺼냅니다\n" +
            "아이템 넣기 (아이템)/(개수)/(to 아이템)/[in item] - 저장공간에 아이템을 넣습니다\n" +
            "아이템 제작 (아이템)/(개수)/[조합법] - 아이템을 제작합니다\n" +
            "\n[어드민 명령어]\n" +
            "아이템 가져오기 (아이템)/(개수)/[to 아이템] - 아이템을 가져옵니다"
        },
        MyInfo : function(bot) {
            let presenter = new Presenter()
            presenter.MyInfo(bot)
            let {name, location, coord, busy, tier} = presenter
            return "내 정보입니다.\n" + Space + 
            "이름 : " + name + "\n" +
            "위치 : " + location + "\n" +
            "좌표 : " + coord[0] + ", " + coord[1] + "\n" +
            "바쁨 : " + (busy ? "예" : "아니오") + "\n" +
            "티어 : " + tier + "\n\n" +
            "인벤은 인벤정보 명령어, 맵은 맵정보 명령어로 정보를 확인할 수 있습니다."
        },
        InvenInfo : function(bot) {
            let presenter = new Presenter()
            presenter.InvenInfo(bot)
            let {invenSpace, invenLimit, invenInfo} = presenter
            return "인벤 정보입니다.\n" + Space + 
            "현재 공간 : " + invenSpace + " / " + invenLimit + "\n\n" +
            "아이템\n" + (invenInfo || "없음")
        },
        MapInfo : function(bot) {
            let presenter = new Presenter()
            presenter.MapInfo(bot)
            let {location, coord, biome, mapInfo} = presenter
            return "맵 정보입니다.\n" + Space + 
            "장소 이름 : " + location + "\n" +
            "좌표 : " + coord + "\n" +
            "바이옴 : " + biome + "\n\n" + mapInfo
        },
        CollectItem : function(bot) {
            let presenter = new Presenter()
            presenter.CollectItem(bot)
            let {item, number, time, tool, withItem} = presenter
            return [
                [
                    (tool ? (tool + " 을(를) 사용해서") : "") + item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 수집합니다.\n" +
                    "아이템을 수집하는데 " + time + "초가 걸립니다."
                ],
                ["아이템을 모두 수집했습니다.", time*1000]
            ]
        },
        DumpItem : function(bot) {
            let presenter = new Presenter()
            presenter.DumpItem(bot)
            let {item, number, withItem} = presenter
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + number + "개 버립니다."
        },
        RetrieveItem : function(bot) {
            let presenter = new Presenter()
            presenter.RetrieveItem(bot)
            let {item, number, withItem} = presenter
            return item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 회수합니다."
        },
        GetItem : function(bot) {
            let presenter = new Presenter()
            presenter.GetItem(bot)
            let {item, number, store, withItem} = presenter
            if(withItem) {
                return store + " 에 있는 " + item + " 을(를) " + number + "개 꺼내서 " + withItem + " 에 넣습니다."
            }
            return store + " 에 있는 " + item + " 을(를) " + number + "개 꺼냅니다."
        },
        PutItem : function(bot) {
            let presenter = new Presenter()
            presenter.PutItem(bot)
            let {item, number, store, withItem} = presenter
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + store + " 에다 " + number + "개 넣습니다."
        },
        CraftItem : function(bot) {
            let presenter = new Presenter()
            presenter.CraftItem(bot)
            let {craftInfo, item, number, time, need, useItems} = presenter

            if(craftInfo) {
                return "조합법이 여러가지가 있습니다.\n" +
                   "/(숫자) 형식으로 조합법을 정해주세요.\n\n" + Space +
                   craftInfo.map((v, i) => (i+1) + "번 조합법\n" + v).join("\n\n")
            }

            return [
                [
                    (need ? (need + " 을(를) 사용해서") : "") + item + " 을(를) " + number + "개 제작합니다.\n" +
                    "아이템을 제작하는데 " + time + "초가 걸립니다.\n" +
                    "사용 아이템\n" +
                    useItems.map(v => v.length === 3 ? 
                                      v[0] + "의 내구도 : " + v[1] + "만큼 사용":
                                      v[0] + " : " + v[1] + "개 사용").join("\n")
                ],
                ["아이템을 모두 제작했습니다.", time*1000]
            ]
        },
        ChooseNum : function(bot) {
            let presenter = new Presenter()
            presenter.ChooseNum(bot)
            let {message} = presenter

            return message
        },
        BringItem : function(bot) {
            let presenter = new Presenter()
            presenter.BringItem(bot)
            let {item, number, withItem} = presenter
            return "[어드민 명령어]\n" +
            item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 가져옵니다."
        }
    }

    module.exports = View
})()