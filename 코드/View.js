(function() {
    "use strict"
    const Setting = require("./Setting")
    const Space = Setting.nodeJS ? "" : '\u200b'.repeat(500)
    const Presenter = require("./Presenter")
    const presenter = new Presenter()

    /**
     * 채팅 객체
     * @typedef {object} bot
     * @property {string} frontPrefix
     * @property {string} cmdPrefix
     * @property {string} roomPrefix
     * @property {string} dataSeparator
     * @property {string} content
     * @property {string[]} args
     * @property {string} data
     * @property {string} package
     * @property {string} room
     * @property {string} sender
     * @property {number} hash
     * @property {boolean} isGroupChat
     * @property {boolean} isDebugRoom
     * @property {boolean} isBotOn
     */

    /** 답장을 만드는 모듈 */
    const View = {
        /**
         * 회원가입 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        SignUp : function(bot) {
            presenter.SignUp(bot)
            return "회원가입을 완료했습니다."
        },

        /**
         * 명령어 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        Command : function(bot) {
            presenter.Command(bot)
            return "명령어 목록입니다\n" + Space + 
            "/회원가입 - 회원가입을 합니다\n" + 
            "/명령어 - 명령어 목록을 보여줍니다\n" +
            "/내정보 - 내 정보를 보여줍니다\n" +
            "/맵정보 [위치] - 맵 정보를 보여줍니다\n" +
            "/아이템 정보 (아이템) - 아이템 정보를 보여줍니다\n" +
            "/제작 정보 (아이템) - 제작 정보를 보여줍니다\n" +
            "/탐험 [좌표] - 맵을 탐험합니다\n" +
            "/이동 (장소 또는 좌표) - 다른 장소로 이동합니다\n" +
            "/아이템 수집 (아이템)/(개수)/[to 아이템] - 아이템을 수집합니다\n" +
            "/아이템 버리기 (아이템)/(개수)/[in 아이템] - 아이템을 버립니다\n" +
            "/아이템 회수 (아이템)/(개수)/[to 아이템] - 버린 아이템을 수집합니다\n" +
            "/아이템 꺼내기 (아이템)/(개수)/(in 아이템/기구)/[to 아이템] - 저장공간에서 아이템을 꺼냅니다\n" +
            "/아이템 넣기 (아이템)/(개수)/(to 아이템/기구)/[in 아이템] - 저장공간에 아이템을 넣습니다\n" +
            "/아이템 제작 (아이템)/(개수)/[조합법] - 아이템을 제작합니다\n" +
            "/기구 설치 (아이템)/[개수] - 기구를 설치합니다\n" +
            "/기구 회수 (아이템)/[개수] - 기구를 회수합니다\n" +
            "/글 검색 (검색어) - 검색어로 글을 검색합니다\n" +
            "/글 목록 - 글 목록을 보여줍니다\n" +
            "/글 읽기 (제목) - 해당 제목의 글을 보여줍니다\n" +
            "/글 쓰기 (제목)줄바꿈(내용) - 해당 제목의 새로운 글을 작성합니다\n" +
            "/글 추가 (제목)줄바꿈(내용) - 해당 제목의 글에 내용을 추가합니다\n" +
            "/글 삭제 (제목) - 해당 제목의 글을 삭제합니다\n" +
            "\n[어드민 명령어]\n" +
            "/아이템 가져오기 (아이템)/(개수)/[to 아이템] - 아이템을 가져옵니다\n" +
            "/아이템 목록 - 전체 아이템 목록을 가져옵니다\n" +
            "/해시 변경 (기존해시)/(바꿀해시) - 해시코드를 바꿉니다\n" +
            "/해시 찾기 (이름) - 해당 이름을 가진 유저의 해시코드를 찾습니다"
        },

        /**
         * 내정보 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        MyInfo : function(bot) {
            let {name, location, coord, busy, tier, invenSpace, invenLimit, invenInfo} = presenter.MyInfo(bot)
            return "내 정보입니다.\n" + Space + 
            "이름 : " + name + "\n" +
            "위치 : " + location + "\n" +
            "좌표 : " + coord[0] + ", " + coord[1] + "\n" +
            "바쁨 : " + (busy ? "예" : "아니오") + "\n" +
            "티어 : " + tier + "\n\n" +
            "인벤 정보\n" + Space + 
            "현재 공간 : " + invenSpace + " / " + invenLimit + "\n\n" +
            "아이템\n" + (invenInfo || "없음") + "\n\n" +
            "맵과 기구는 맵정보 명령어로 정보를 확인할 수 있습니다."
        },

        /**
         * 맵정보 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        MapInfo : function(bot) {
            let {location, coord, biome, mapInfo} = presenter.MapInfo(bot)
            return "맵 정보입니다.\n" + Space + 
            "장소 이름 : " + location + "\n" +
            "좌표 : " + coord + "\n" +
            "바이옴 : " + biome + "\n\n" + mapInfo
        },

        /**
         * 아이템 정보 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        ItemInfo : function(bot) {
            let {item, itemInfo, isCraft} = presenter.ItemInfo(bot)
            return item + "의 정보입니다.\n" + Space + itemInfo + "\n" +
            "제작 가능 여부 : " + (isCraft ? "O" : "X")
        },

        /**
         * 제작 정보 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        CraftInfo : function(bot) {
            let {item, craftInfo} = presenter.CraftInfo(bot)
            return item + "의 조합법입니다.\n" + Space + craftInfo
        },

        /**
         * 탐험 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        Explore : function(bot) {
            let {} = presenter.Explore(bot)
        },

        /**
         * 이동 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        MoveLocation : function(bot) {
            let {} = presenter.MoveLocation(bot)
        },

        /**
         * 아이템 수집 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        CollectItem : function(bot) {
            let {item, number, time, tool, withItem} = presenter.CollectItem(bot)
            return [
                [
                    (tool ? (tool + " 을(를) 사용해서") : "") + item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 수집합니다.\n" +
                    "아이템을 수집하는데 " + time + "초가 걸립니다."
                ],
                ["아이템을 모두 수집했습니다.", time*1000]
            ]
        },

        /**
         * 아이템 버리기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        DumpItem : function(bot) {
            let {item, number, withItem} = presenter.DumpItem(bot)
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + number + "개 버립니다."
        },

        /**
         * 아이템 회수 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        RetrieveItem : function(bot) {
            let {item, number, withItem} = presenter.RetrieveItem(bot)
            return item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 회수합니다."
        },

        /**
         * 아이템 꺼내기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        GetItem : function(bot) {
            let {item, number, store, withItem} = presenter.GetItem(bot)
            if(withItem) {
                return store + " 에 있는 " + item + " 을(를) " + number + "개 꺼내서 " + withItem + " 에 넣습니다."
            }
            return store + " 에 있는 " + item + " 을(를) " + number + "개 꺼냅니다."
        },

        /**
         * 아이템 넣기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        PutItem : function(bot) {
            let {item, number, store, withItem} = presenter.PutItem(bot)
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + store + " 에다 " + number + "개 넣습니다."
        },

        /**
         * 아이템 제작 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string|array[]}
         */
        CraftItem : function(bot) {
            let {craftInfo, item, number, time, need, useItems} = presenter.CraftItem(bot)

            if(craftInfo) {
                return "조합법이 여러가지가 있습니다.\n" +
                   "/(숫자) 형식으로 조합법을 정해주세요.\n" + 
                   "/0으로 취소할 수 있습니다.\n\n" + Space + craftInfo
            }

            return [
                [
                    (need ? (need + " 을(를) 사용해서 ") : "") + item + " 을(를) " + number + "개 제작합니다.\n" +
                    "아이템을 제작하는데 " + time + "초가 걸립니다.\n" +
                    "사용 아이템\n" +
                    useItems.map(v => v.length === 3 ? 
                                      v[0] + "의 내구도 : " + v[1] + "만큼 사용":
                                      v[0] + " : " + v[1] + "개 사용").join("\n")
                ],
                ["아이템을 모두 제작했습니다.", time*1000]
            ]
        },

        /**
         * 기구 설치 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        InstallMachine : function(bot) {
            let {item, number} = presenter.InstallMachine(bot)
            return item + "(을)를 " + number + "개 설치했습니다."
        },

        /**
         * 기구 회수 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        RetrieveMachine : function(bot) {
            let {item, number, time, tool} = presenter.RetrieveMachine(bot)
            return [
                [
                    (tool ? (tool + " 을(를) 사용해서 ") : "") + item + " 을(를) " + number + "개 회수합니다.\n" +
                    "기구를 회수하는데 " + time + "초가 걸립니다."
                ],
                ["기구를 회수했습니다.", time*1000]
            ]
        },

        /**
         * 글 검색 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        SearchWriting : function(bot) {
            let {word, list} = presenter.SearchWriting(bot)
            return word + "(으)로 검색한 결과입니다.\n" + Space + 
                   (list.length === 0 ? "없음" : list.join("\n"))
        },

        /**
         * 글 목록 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        ListWriting : function(bot) {
            let {list} = presenter.ListWriting(bot)
            return "글 목록입니다.\n" + Space + list.join("\n")
        },

        /**
         * 글 읽기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        ReadWriting : function(bot) {
            let {title, text} = presenter.ReadWriting(bot)
            return "제목 : " + title + "\n" + Space + "내용 : " + text
        },

        /**
         * 글 쓰기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        MakeWriting : function(bot) {
            let {title, text} = presenter.MakeWriting(bot)
            return "글이 작성되었습니다.\n" + Space + 
                   "제목 : " + title + "\n내용 : " + text
        },

        /**
         * 글 삭제 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        DeleteWriting : function(bot) {
            let {title, text} = presenter.DeleteWriting(bot)
            return "글이 삭제되었습니다.\n" + Space +
                   "제목 : " + title + "\n내용 : " + text
        },

        /**
         * 글 추가 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        AppendWriting : function(bot) {
            let {title, text} = presenter.AppendWriting(bot)
            return "글이 추가되었습니다.\n" + Space +
                   "제목 : " + title + "\n내용 : " + text
        },

        /**
         * 선택에 맞게 메시지를 만듦
         * @param {bot} bot 
         * @returns {string}
         */
        ChooseNum : function(bot) {
            let result = presenter.ChooseNum(bot)
            return result ? result.message : ""
        },

        /**
         * 아이템 가져오기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        BringItem : function(bot) {
            let {item, number, withItem} = presenter.BringItem(bot)
            return "[어드민 명령어]\n" +
            item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 가져옵니다."
        },

        /**
         * 아이템 목록 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        ListItem : function(bot) {
            let {list} = presenter.ListItem(bot)
            return "[어드민 명령어]\n" +
            "아이템 목록입니다." + Space + "\n" + list.join("\n")
        },

        /**
         * 해시 변경 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        ChangeHash : function(bot) {
            let {hash1, hash2} = presenter.ChangeHash(bot)
            return "[어드민 명령어]\n" +
            hash1 + "에서 " + hash2 + "로 해시를 변경했습니다."
        },

        /**
         * 해시 찾기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        FindHash : function(bot) {
            let {name, userInfo} = presenter.FindHash(bot)
            return name + "(으)로 검색한 결과입니다.\n" + Space + 
            userInfo.map((v, i) => (i+1) + "번 유저\n" + 
            "해시 : " + v.hash + "\n" +
            "이름 : " + v.name + "\n" +
            "위치 : " + v.location + "\n" +
            "좌표 : " + v.coord[0] + ", " + v.coord[1] + "\n" +
            "티어 : " + v.tier).join("\n\n")
        }
    }

    module.exports = View
})()