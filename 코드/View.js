(function() {
    "use strict"
    const Setting = require("./Setting")
    const Space = Setting.nodeJS ? "" : '\u200b'.repeat(500)
    const Presenter = require("./Presenter")
    const presenter = new Presenter()

    /**
     * 좌표는 [x,y] 입니다.
     * 
     * 아이템 종류는 아래와 같습니다.
     * item : 일반 아이템(ex 모래)
     * liquid : 액체 아이템(ex 물)
     * hold : 저장공간이 있는 아이템(ex 세라믹 항아리)
     * tool : 도구 아이템(ex 돌 도끼)
     * wear : 입을 수 있는 아이템(ex 가죽 갑옷) - 미구현
     * store : 아이템을 저장 가능한 기구 아이템(ex 상자)
     * use : 직접 사용하는 기구 아이템(ex 조합대)
     * auto : 연료를 사용하는 기구 아이템(ex 모닥불) - 미구현
     * 
     * 도구 종류는 아래와 같습니다.
     * pickaxe : 곡괭이, axe : 도끼, shovel : 삽, sword : 칼
     */

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

    /**
     * 아이템 객체
     * @typedef {object} item
     * @property {string} name  아이템 이름
     * @property {number} number  아이템 개수
     * @property {type} type  아이템 종류
     * @property {number} stack  아이템이 겹쳐질 수 있는 개수
     * @property {string|undefined} nick  아이템의 닉네임
     * @property {meta|undefined} meta  아이템의 특수 속성
     * 
     * 아이템 종류가 tool, hold, store(실치된 기구일 때만) 일 때 nick과 meta 속성을 가집니다.
     * 
     * @typedef {object} meta
     * @property {number|undefined} durability  도구 내구도 - tool
     * @property {string|undefined} class  도구 종류 - tool
     * @property {number|undefined} speed  도구 속도 - tool
     * @property {number|undefined} damage  도구 데미지(없으면 0) - tool
     * @property {number|undefined} tier  도구 티어 - tool
     * @property {item[]|undefined} inven  인벤토리 - hold, store(설치된 기구일 때)
     * @property {invenSetting|undefined} invenSetting  인벤토리 설정값 - hold, store(설치된 기구일 때)
     * @property {number|undefined} invenSpace  인벤토리 차지한 공간 - hold, store(설치된 기구일 때)
     * 
     * '-' 뒤에 써놓은 종류의 아이템만 해당 속성을 가지고 있습니다.
     */

    /**
     * 인벤토리 설정값 객체
     * @typedef {object} invenSetting
     * @property {number} invenLimit  인벤토리 공간
     * @property {boolean} canItem  고체를 담을 수 있는지 여부
     * @property {boolean} canLiquid  액체를 담을 수 있는지 여부
     * @property {string[]} includeItem  추가적으로 담을 수 있는 아이템 목록
     * @property {string[]} excludeItem  추가적으로 담을 수 없는 아이템 목록
     * @property {number|undefined} itemStack  고체가 몇개까지 겹쳐지는지
     * @property {number|undefined} liquidStack  액체가 몇개까지 겹쳐지는지
     * @property {boolean} isInstall  맵에 설치된 기구 인벤 여부
     */

    /**
     * 장소 객체
     * @typedef {object} locate
     * @property {number[]} coord  장소 좌표
     * @property {string} name  장소 이름
     * @property {string} biome  장소 바이옴
     */

    function 받침(str) {
        // 십(영), 일, 이, 삼, 사, 오, 육, 칠, 팔, 구
        let number = [true, true, false, true, false, false, true, true, true, false]
        str = str[str.length-1]
        return isNaN(str) ? str.normalize("NFD").length === 3 : number[Number(str)]
    }

    function 와과(str) {
        return 받침(str) ? "과" : "와"
    }

    function 을를(str) {
        return 받침(str) ? "을" : "를"
    }

    function 이가(str) {
        return 받침(str) ? "이가" : "가"
    }

    function 은는(str) {
        return 받침(str) ? "은" : "는"
    }

    /** 답장을 만드는 모듈 */
    const View = {
        /**
         * 아이템 정보 텍스트를 만듬
         * @param { {itemInfo : object, collectInfo : object|null, toolInfo : object|null, invenInfo : object|null} } itemAllInfo  모든 아이템 정보
         * @returns {string}
         */
        itemInfo : function(itemAllInfo) {
            /**
             * @property { {type : string, stack : number, heat : number} } itemInfo  기본 아이템 정보
             * type : 아이템 종류, stack : 아이템 겹쳐지는 개수, heat : 연료량(연료로 사용할 수 없다면 0)
             * @property { {collectTime : number, tier : number, effective : string|null} | null } collectInfo  아이템 수집 관련 정보
             * collectTime : 아이템 수집에 걸리는 시간, tier : 수집에 필요한 최소 도구의 티어, effective : 어떤 종류의 도구를 써야 빠르게 수집하는가(없다면 null)
             * @property { {durability : number, tier : number, speed : number, damage : number|null} | null} toolInfo  도구 아이템 정보
             * durability : 도구 내구도, tier : 도구 티어, speed : 얼마나 빠른지(기본값 : 1(배)), damage : 데미지(없다면 0)
             * @property {invenSetting|null} invenInfo  아이템이 가진 인벤토리 정보
             */
            let {itemInfo, collectInfo, toolInfo, invenInfo} = itemAllInfo
            let result = "종류 : " + itemInfo.type + ", 스택 : " + itemInfo.stack + ", 연료량 : " + (itemInfo.heat || "없음")

            if(collectInfo) {
                result += "\n수집 시간 : " + collectInfo.collectTime + ", 티어 : " + collectInfo.tier + ", 수집 도구 : " + (collectInfo.effective || "없음")
            }

            if(itemInfo.type === "tool") {
                result += "\n내구도 : " + toolInfo.durability + ", 티어 : " + toolInfo.tier + ", 속도 : " + toolInfo.speed + ", 데미지 : " + (toolInfo.damage || "없음")
            } else if(itemInfo.type === "hold") {
                result += "\n저장 공간 : " + invenInfo.invenLimit + ", 아이템 저장 여부 : " + (invenInfo.canItem ? "O" : "X") +
                ", 액체 저장 여부 : " + (invenInfo.canLiquid ? "O" : "X") + "\n" + "아이템 스택 : " + (invenInfo.itemStack || "없음") + ", 액체 스택 : " + (invenInfo.liquidStack || "없음")
            }
            return result
        },

        /**
         * 인벤 정보 텍스트를 만듬
         * @param {item[]} inven  인벤토리
         * @param {invenSetting} invenSetting  인벤토리 설정값
         * @param {string|undefined} space  답장 들여쓰기
         * @returns {string}
         */
        invenInfo : function(inven, invenSetting, space) {
            space = space === undefined ? "" : space
            let result = []
            for(let item of inven) {
                result.push(this.invenItemInfo(item, invenSetting, space))
            }
            return result.join("\n")
        },

        /**
         * 인벤에 있는 아이템 정보 텍스트를 만듬
         * @param {item} item  아이템
         * @param {invenSetting} invenSetting  인벤토리 설정값
         * @param {string} space  답장 들여쓰기
         * @returns {string}
         */
        invenItemInfo : function(item, invenSetting, space) {
            let result = space + "이름 : " + (item.nick || item.name) + ", 개수 : " + item.number
            if(item.type === "tool") {
                result += "\n" + space + "  내구도 : " + item.meta.durability + ", 속도 : " + item.meta.speed + ", 데미지 : " + (item.meta.damage || "없음")
            }

            if(item.type === "hold" || (item.type === "store" && invenSetting.isInstall)) {
                let inven = item.meta.inven
                let setting = item.meta.invenSetting
                space += "  "
                result += "\n" + space + "아이템 인벤 공간 : " + item.meta.invenSpace + " / " + setting.invenLimit + "\n" +
                        space + "아이템\n" + (this.invenInfo(inven, setting, space) || space + "없음")
            }
            return result
        },

        /**
         * 제작법 정보 텍스트를 만듬
         * @param { {items : object, tools : object[]}} itemInfo  필요한 아이템 정보
         * @param { {number : number, time : number, need : string|null} } craftInfo  기본 제작 정보
         * @returns {string}
         */
        craftInfo : function(itemInfo, craftInfo) {
            /**
             * @property {object<string:number>} items  제작에 필요한 아이템 정보(아이템 이름 : 필요 개수 쌍으로 저장되어 있음)
             * @property {Array<{tier : number, class : string|null, durability : number, name : string|null}>} tools  제작에 필요한 도구 정보
             * tier : 필요한 최소 도구 티어, class : 도구 종류, durability : 필요 내구도, name : 도구 이름
             */
            let {items, tools} = itemInfo
            /**
             * @property {number} number  제작 한번에 만들어지는 개수
             * @property {number} time  제작에 걸리는 시간
             * @property {string|null} need  제작에 필요한 기구
             */
            let {number, time, need} = craftInfo
            return "만들어 지는 개수 : " + number + "\n" +
                "필요 시간 : " + time + "초, 필요 기구 : " + (need ? need : "없음") + "\n" +
                "사용 아이템\n" +
                Object.keys(items).map(v => v + " : " + items[v] + "개 사용").join("\n") +
                (tools.length === 0 ? "" : "\n" + tools.map(v => v.tier ?
                    v.tier + "티어 이상 " + v.class + " 도구의 내구도 : " + v.durability + "만큼 사용" :
                    v.name + "의 내구도 : " + v.durability + "만큼 사용"
                ).join("\n"))
        },

        /**
         * 여러 제작법 정보 텍스트를 만듬
         * @param { {itemInfo : object, craftInfo : object} } craftAllInfos 
         * @returns {string}
         */
        craftInfos : function(craftAllInfos) {
            let result = []
            for(let craftAllInfo of craftAllInfos) {
                let {itemInfo, craftInfo} = craftAllInfo
                result.push(this.craftInfo(itemInfo, craftInfo))
            }
            return result.map((v, i) => (i+1) + "번 조합법\n" + v).join("\n\n")
        },

        /**
         * 맵 정보 텍스트를 만듬
         * @param { {inven : item[], invenSetting : invenSetting} } items  수집 가능한 아이템
         * @param { {inven : item[], invenSetting : invenSetting} } dumpItems  버린 아이템
         * @param { {inven : item[], invenSetting : invenSetting} } installs  설치한 기구
         * @returns {string}
         */
        mapInfo : function(items, dumpItems, installs) {
            return "아이템\n" + (this.invenInfo(items.inven, items.invenSetting) || "없음") + "\n\n" +
            "버린 아이템\n" + (this.invenInfo(dumpItems.inven, dumpItems.invenSetting) || "없음") + "\n\n" +
            "설치된 기구\n" + (this.invenInfo(installs.inven, installs.invenSetting) || "없음")
        },

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
            "/맵정보 [(장소) 또는 (x좌표)/(y좌표)] - 맵 정보를 보여줍니다\n" +
            "/아이템 정보 (아이템) - 아이템 정보를 보여줍니다\n" +
            "/제작 정보 (아이템) - 제작 정보를 보여줍니다\n" +
            "/탐험 (x좌표)/(y좌표) - 맵을 탐험합니다\n" +
            "/이동 ((장소) 또는 (x좌표)/(y좌표)) - 해당 장소로 이동합니다\n" +
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
            /**
             * @property {string} name  유저 이름
             * @property {string} location  현재 장소 이름
             * @property {number[]} coord  현재 좌표
             * @property {boolean} busy  바쁜지 여부
             * @property {number} tier  유저 티어
             * @property {item[]} inven  유저 인벤토리
             * @property {invenSetting} invenSetting  유저 인벤토리 설정값
             * @property {number} invenSpace  사용한 인벤 공간
             * @property {locate[]} mapList  유저 맵 정보
             */
            let {name, location, coord, busy, tier, inven, invenSetting, invenSpace, mapList} = presenter.MyInfo(bot)
            return "내 정보입니다.\n" + Space + 
            "이름 : " + name + "\n" +
            "위치 : " + location + "\n" +
            "좌표 : " + coord.join(", ") + "\n" +
            "바쁨 : " + (busy ? "예" : "아니오") + "\n" +
            "티어 : " + tier + "\n\n" +
            "인벤 정보\n" + Space + 
            "현재 공간 : " + invenSpace + " / " + invenSetting.invenLimit + "\n\n" +
            "아이템\n" + (this.invenInfo(inven, invenSetting) || "없음") + "\n\n" + 
            "맵 목록\n" + mapList.map(v => "좌표 : " + v.coord.join(", ") + ", 이름 : " + v.name + ", 바이옴 : " + v.biome).join("\n") + "\n\n" +
            "맵과 기구 정보는 맵정보 명령어로 확인할 수 있습니다."
        },

        /**
         * 맵정보 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        MapInfo : function(bot) {
            /**
             * @property {string} location  장소 이름
             * @property {number[]} coord  장소 좌표
             * @property {string} biome  장소 바이옴
             * @property { {inven : inven, invenSetting : invenSetting} } items  수집 가능한 아이템
             * @property { {inven : inven, invenSetting : invenSetting} } dumpItems  버린 아이템
             * @property { {inven : inven, invenSetting : invenSetting} } installs  설치한 기구
             */
            let {location, coord, biome, items, dumpItems, installs} = presenter.MapInfo(bot)
            return "맵 정보입니다.\n" + Space + 
            "장소 이름 : " + location + "\n" +
            "좌표 : " + coord + "\n" +
            "바이옴 : " + biome + "\n\n" + this.mapInfo(items, dumpItems, installs)
        },

        /**
         * 아이템 정보 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        ItemInfo : function(bot) {
            /**
             * @property {string} item  아이템 이름
             * @property {object} itemAllInfo  아이템 정보
             * @property {boolean} isCraft  제작 가능 여부
             */
            let {item, itemAllInfo, isCraft} = presenter.ItemInfo(bot)
            return item + "의 정보입니다.\n" + Space + this.itemInfo(itemAllInfo) + "\n" +
            "제작 가능 여부 : " + (isCraft ? "O" : "X")
        },

        /**
         * 제작 정보 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        CraftInfo : function(bot) {
            /**
             * @property {string} item  아이템 이름
             * @property {Array<{itemInfo : object, craftInfo : object}>} craftAllInfos  제작 정보
             */
            let {item, craftAllInfos} = presenter.CraftInfo(bot)
            return item + "의 조합법입니다.\n" + Space + this.craftInfos(craftAllInfos)
        },

        /**
         * 탐험 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        Explore : function(bot) {
            /**
             * @property {locate[]} explore  탐험한 맵 정보
             * @property {number} time  탐험에 걸리는 시간
             * @property {number[]} coord  목표 좌표
             */
            let {explore, time, coord} = presenter.Explore(bot)
            return [
                [
                    coord.join(", ") + " (으)로 이동하면서 탐험합니다.\n" +
                    "모두 탐험하는데 " + time + "초가 걸립니다."
                ],
                [
                    "탐험 결과입니다.\n" + Space + 
                    explore.map(v => "좌표 : " + v.coord.join(", ") + ", 이름 : " + v.name + ", 바이옴 : " + v.biome).join("\n"),
                    time * 1000
                ]
            ]
        },

        /**
         * 이동 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        MoveLocation : function(bot) {
            /**
             * @property {number} time  이동에 걸리는 시간
             * @property {string} place  목표 장소 이름
             * @property {number[]} coord  목표 좌표
             */
            let {time, place, coord} = presenter.MoveLocation(bot)
            return [
                [
                    coord.join(", ") + "에 있는 " + place + " (으)로 이동합니다.\n" +
                    "이동하는데 " + time + "초가 걸립니다."
                ],
                [place + " 에 도착했습니다.", time * 1000]
            ]
        },

        /**
         * 아이템 수집 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        CollectItem : function(bot) {
            /**
             * @property {string} item  수집한 아이템 이름
             * @property {number} number  수집한 아이템 개수
             * @property {number} time  수집에 걸리는 시간
             * @property {string|null} tool  수집에 사용한 도구
             * @property {string|null} withItem  수집한 아이템을 담을 아이템
             */
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
            /**
             * @property {string} item  버린 아이템 이름
             * @property {number} number  버린 아이템 개수
             * @property {string|null} withItem  버릴 아이템을 담고 있던 아이템
             */
            let {item, number, withItem} = presenter.DumpItem(bot)
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + number + "개 버립니다."
        },

        /**
         * 아이템 회수 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        RetrieveItem : function(bot) {
            /**
             * @property {string} item  회수한 아이템 이름
             * @property {number} number  회수한 아이템 개수
             * @property {string|null} withItem  회수한 아이템을 담을 아이템
             */
            let {item, number, withItem} = presenter.RetrieveItem(bot)
            return item + " 을(를) " + (withItem ? withItem + " 에다 " : "") + number + "개 회수합니다."
        },

        /**
         * 아이템 꺼내기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        GetItem : function(bot) {
            /**
             * @property {string} item  꺼낸 아이템 이름
             * @property {number} number  꺼낸 아이템 개수
             * @property {string} store  꺼낸 아이템을 담고 있던 아이템 또는 기구
             * @property {string|null} withItem  꺼낸 아이템을 담을 아이템
             */
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
            /**
             * @property {string} item  넣은 아이템 이름
             * @property {number} number  넣은 아이템 개수
             * @property {string} store  넣은 아이템을 담을 아이템 또는 기구
             * @property {string|null} withItem  넣을 아이템을 담고 있던 아이템
             */
            let {item, number, store, withItem} = presenter.PutItem(bot)
            return (withItem ? withItem + " 에다 " : "") + item + " 을(를) " + store + " 에다 " + number + "개 넣습니다."
        },

        /**
         * 아이템 제작 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string|array[]}
         */
        CraftItem : function(bot) {
            /**
             * @property {Array<{itemInfo : object, craftInfo : object}>} craftAllInfos  제작 정보
             * @property {string} item  제작한 아이템 이름
             * @property {number} number  제작한 아이템 개수
             * @property {number} time  제작에 걸리는 시간
             * @property {string} need  제작에 필요한 기구
             * @property {Array<[string, number, string]>} useItems  제작에 들어간 아이템 정보
             */
            let {craftAllInfos, item, number, time, need, useItems} = presenter.CraftItem(bot)

            if(craftAllInfos) {
                return "조합법이 여러가지가 있습니다.\n" +
                   "/(숫자) 형식으로 조합법을 정해주세요.\n" + 
                   "/0으로 취소할 수 있습니다.\n\n" + Space + this.craftInfos(craftAllInfos)
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
            /**
             * @property {string} item  설치한 기구 이름
             * @property {number} number  설치한 기구 개수
             */
            let {item, number} = presenter.InstallMachine(bot)
            return item + "(을)를 " + number + "개 설치했습니다."
        },

        /**
         * 기구 회수 답장을 돌려줌
         * @param {bot} bot 
         * @returns {array[]}
         */
        RetrieveMachine : function(bot) {
            /**
             * @property {string} item  회수한 기구 이름
             * @property {number} number  회수한 기구 개수
             * @property {number} time  회수에 필요한 시간
             * @property {string} tool  회수에 사용한 도구
             */
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
            /**
             * @property {string} word  글 검색 단어
             * @property {string[]} list  검색 결과로 나온 글 제목 목록
             */
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
            /**
             * @property {string[]} list  모든 글 제목 목록
             */
            let {list} = presenter.ListWriting(bot)
            return "글 목록입니다.\n" + Space + list.join("\n")
        },

        /**
         * 글 읽기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        ReadWriting : function(bot) {
            /**
             * @property {string} title  읽을 글 제목
             * @property {string} text  읽을 글 내용
             */
            let {title, text} = presenter.ReadWriting(bot)
            return "제목 : " + title + "\n" + Space + "내용 : " + text
        },

        /**
         * 글 쓰기 답장을 돌려줌
         * @param {bot} bot 
         * @returns {string}
         */
        MakeWriting : function(bot) {
            /**
             * @property {string} title  쓸 글 제목
             * @property {string} text  쓸 글 내용
             */
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
            /**
             * @property {string} title  삭제할 글 제목
             * @property {string} text  삭제한 글 내용
             */
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
            /**
             * @property {string} title  내용을 추가할 글 제목
             * @property {string} text  추가할 내용
             */
            let {title, text} = presenter.AppendWriting(bot)
            return "글이 추가되었습니다.\n" + Space +
                   "제목 : " + title + "\n내용 : " + text
        },

        /**
         * 선택에 맞게 메시지를 만듦
         * (여기는 바꾸지 마세요)
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
            /**
             * @property {string} item  가져올 아이템 이름
             * @property {number} number  가져올 아이템 개수
             * @property {string|null} withItem  가져온 아이템을 넣을 아이템
             */
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
            /**
             * @property {string[]} list  모든 아이템 이름 목록
             */
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
            /**
             * @property {number} hash1  바꾸기 전 해시
             * @property {number} hash2  바꾼 해시
             */
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
            /**
             * @property {string} name  찾는 유저 이름
             * @property {Array<{hash : number, name : string, location : string, coord : number[], tier : number}>} userInfo  유저 정보
             * hash : 유저 해시, name : 유저 이름, location : 현재 장소 이름, coord : 현재 좌표, tier : 유저 티어
             */
            let {name, userInfo} = presenter.FindHash(bot)
            return "[어드민 명령어]\n" +
            name + "(으)로 검색한 결과입니다.\n" + Space + 
            userInfo.map((v, i) => (i+1) + "번 유저\n" + 
            "해시 : " + v.hash + "\n" +
            "이름 : " + v.name + "\n" +
            "위치 : " + v.location + "\n" +
            "좌표 : " + v.coord.join(", ") + "\n" +
            "티어 : " + v.tier).join("\n\n")
        }
    }

    module.exports = View
})()