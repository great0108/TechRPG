(function() {
    "use strict"

    const View = {
        AlreadySignUp : function() {
            return "이미 회원가입이 되어 있습니다."
        },
        SignUp : function() {
            return "회원가입이 완료되었습니다."
        },
        NotSignUp : function() {
            return "회원가입을 먼저 해주세요."
        },
        NotExistItem : function() {
            return "이런 이름의 아이템은 존재하지 않습니다."
        },
        NotNumber : function() {
            return "숫자를 제대로 입력하세요."
        },
        LackMapItem : function() {
            return "맵에 아이템이 없거나 부족합니다."
        },
        LackInvenSpace : function() {
            return "인벤토리 공간이 부족합니다."
        },
        NotHaveItem : function() {
            return "이런 이름의 아이템을 가지고 있지 않습니다."
        },
        CantCollectItem : function() {
            return "아이템을 수집하기 위한 도구가 없습니다."
        },
        NowBusy : function() {
            return "다른 작업을 수행중 입니다."
        },
        Command : function() {
            return "명령어 목록입니다.\n" +
            "회원가입 - 회원가입을 함\n" + 
            "명령어 - 명령어 목록을 띄움\n" +
            "내정보 - 내정보 창을 띄움\n" +
            "인벤정보 - 인벤정보 창을 띄움\n" +
            "아이템 수집 (아이템) (개수) [with item] - 아이템을 수집 함\n" +
            "아이템 회수 (아이템) (개수) [with item] - 버린 아이템을 수집 함\n" +
            "아이템 버림 (아이템) (개수) [in 아이템] - 아이템을 버림"
        },
        MyInfo : function(name, location, busy) {
            return "내 정보입니다.\n" +
            "이름 : " + name + "\n" +
            "위치 : " + location + "\n" +
            "바쁨 : " + (busy ? "예" : "아니오") + "\n\n" +
            "인벤은 인벤정보 명령어, 맵은 맵정보 명령어로 정보를 확인할 수 있습니다."
        },
        InvenInfo : function(itemInfo, invenlimit, invenSpace) {
            return "인벤 정보입니다.\n" +
            "현재 공간 : " + invenSpace + " / " + invenlimit + "\n" +
            "아이템\n" + itemInfo
        },
        MapInfo : function(mapInfo) {
            return "맵 정보입니다.\n" + mapInfo
        },
        CollectItem : function(item, number, time, tool, withItem) {
            return [
                [
                    tool && (tool.nick + "을(를) 사용해서") + item + "을(를) " + withItem && (withItem + "에 ") + number + "개 수집합니다.\n" +
                    "아이템을 수집하는데 " + time + "초가 걸립니다.",
                    1
                ],
                ["아이템을 모두 수집했습니다.", time*1000]
            ]

        }

    }

    module.exports = View
})()