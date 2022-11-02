(function() {
    "use strict"

    const Err = {
        AlreadySignUp : function() {
            throw new Error("이미 회원가입이 되어 있습니다.")
        },
        NotSignUp : function() {
            throw new Error("회원가입을 먼저 해주세요.")
        },
        NotExistUser : function() {
            throw new Error("이런 유저는 존재하지 않습니다.")
        },
        NotExistItem : function() {
            throw new Error("이런 이름의 아이템은 존재하지 않습니다.")
        },
        NotExistBiome : function() {
            throw new Error("이런 이름의 바이옴은 존재하지 않습니다.")
        },
        NotExistCraft : function() {
            throw new Error("이런 이름의 아이템의 조합법은 존재하지 않습니다.")
        },
        NotExistLocate : function() {
            throw new Error("이런 이름의 장소는 존재하지 않습니다.")
        },
        NotNumber : function() {
            throw new Error("숫자를 제대로 입력하세요.")
        },
        OutOfRangeNumber : function() {
            throw new Error("숫자가 너무 크거나 작습니다.")
        },
        OutOfRangeCraftNum : function() {
            throw new Error("조합법 숫자가 너무 크거나 작습니다.")
        },
        LackMapItem : function() {
            throw new Error("맵에 아이템이 없거나 부족합니다.")
        },
        LackInvenSpace : function() {
            throw new Error("인벤토리 공간이 부족합니다.")
        },
        LackInvenItem : function() {
            throw new Error("인벤토리에 아이템이 없거나 부족합니다.")
        },
        LackInvenTool : function() {
            throw new Error("인벤토리에 도구가 없거나 내구도가 부족합니다.")
        },
        NotHaveItem : function() {
            throw new Error("이런 이름의 아이템을 가지고 있지 않습니다.")
        },
        CantCollectItem : function() {
            throw new Error("아이템을 수집하기 위한 도구가 없습니다.")
        },
        NowBusy : function() {
            throw new Error("다른 작업을 수행중 입니다.")
        },
        CantFindStore : function() {
            throw new Error("저장공간을 찾을 수 없습니다.")
        },
        CantFindInstall : function() {
            throw new Error("기구를 찾을 수 없습니다.")
        },
        CommandError : function() {
            throw new Error("명령어를 제대로 입력하세요")
        },
        CancleCommand : function() {
            throw new Error("명령어를 취소합니다.")
        }
    }

    module.exports = Err
})()