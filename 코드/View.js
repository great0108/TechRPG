(function() {
    "use strict"
    const Setting = require("./Setting")
    const Space = Setting.nodeJS ? "" : '\u200b'.repeat(500)

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
        NotExistMap : function() {
            return "이런 이름의 장소는 존재하지 않습니다."
        },
        NotNumber : function() {
            return "숫자를 제대로 입력하세요."
        },
        OutOfRangeNumber : function() {
            return "숫자가 너무 크거나 작습니다."
        },
        OutOfRangeCraftNum : function() {
            return "조합법 숫자가 너무 크거나 작습니다."
        },
        LackMapItem : function() {
            return "맵에 아이템이 없거나 부족합니다."
        },
        LackInvenSpace : function() {
            return "인벤토리 공간이 부족합니다."
        },
        LackInvenItem : function() {
            return "인벤토리에 아이템이 없거나 부족합니다."
        },
        LackInvenTool : function() {
            return "인벤토리에 도구가 없거나 내구도가 부족합니다."
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
        CantFindStore : function() {
            return "저장공간을 찾을 수 없습니다."
        },
        CantFindInstall : function() {
            return "기구를 찾을 수 없습니다."
        },
        CommandError : function() {
            return "명령어를 제대로 입력하세요"
        },
        Command : function() {
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
        MyInfo : function(name, location, coord, busy, tier) {
            return "내 정보입니다.\n" + Space + 
            "이름 : " + name + "\n" +
            "위치 : " + location + "\n" +
            "좌표 : " + coord[0] + ", " + coord[1] + "\n" +
            "바쁨 : " + (busy ? "예" : "아니오") + "\n" +
            "티어 : " + tier + "\n\n" +
            "인벤은 인벤정보 명령어, 맵은 맵정보 명령어로 정보를 확인할 수 있습니다."
        },
        InvenInfo : function(itemInfo, invenlimit, invenSpace) {
            return "인벤 정보입니다.\n" + Space + 
            "현재 공간 : " + invenSpace + " / " + invenlimit + "\n\n" +
            "아이템\n" + (itemInfo || "없음")
        },
        MapInfo : function(location, coord, biome, mapInfo) {
            return "맵 정보입니다.\n" + Space + 
            "장소 이름 : " + location + "\n" +
            "좌표 : " + coord + "\n" +
            "바이옴 : " + biome + "\n\n" + mapInfo
        },
        CollectItem : function(item, number, time, tool, withItem) {
            return [
                [
                    (tool ? (tool.nick + " 을(를) 사용해서") : "") + item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 수집합니다.\n" +
                    "아이템을 수집하는데 " + time + "초가 걸립니다."
                ],
                ["아이템을 모두 수집했습니다.", time*1000]
            ]
        },
        DumpItem : function(item, number, withItem) {
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + number + "개 버립니다."
        },
        RetrieveItem : function(item, number, withItem) {
            return item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 회수합니다."
        },
        GetItem : function(item, number, store, withItem) {
            if(withItem) {
                return store + " 에 있는 " + item + " 을(를) " + number + "개 꺼내서 " + withItem + " 에 넣습니다."
            }
            return store + " 에 있는 " + item + " 을(를) " + number + "개 꺼냅니다."
        },
        PutItem : function(item, number, store, withItem) {
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + store + " 에다 " + number + "개 넣습니다."
        },
        ChooseCraftNum : function(craftInfo) {
            return "조합법이 여러가지가 있습니다.\n" +
                   "/(숫자) 형식으로 조합법을 정해주세요.\n\n" + Space +
                   craftInfo.map((v, i) => (i+1) + "번 조합법\n" + v).join("\n\n")
        },
        CraftItem : function(item, number) {

        },
        BringItem : function(item, number, withItem) {
            return "[어드민 명령어]\n" +
            item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 가져옵니다."
        }
    }

    module.exports = View
})()