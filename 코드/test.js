const response = require("./main")
// const UserDao = require("./Dao/UserDao")
// UserDao.update()

//response([123456], "실험방", "/인벤정보", "sender")
response([123456], "실험방", "/아이템 제작 나무 판자/1/3", "sender")
//response([123456], "실험방", "/1", "sender")

// 버전 : 0.2.0

// 명령어 목록

// 회원가입 - 회원가입을 합니다
// 명령어 - 명령어 목록을 보여줍니다
// 내정보 - 내 정보를 보여줍니다
// 인벤정보 - 인벤 정보를 보여줍니다
// 맵정보 [위치] - 맵 정보를 보여줍니다
// 아이템 수집 (아이템)/(개수)/[to item] - 아이템을 수집합니다
// 아이템 회수 (아이템)/(개수)/[to item] - 버린 아이템을 수집합니다
// 아이템 버리기 (아이템)/(개수)/[in 아이템] - 아이템을 버립니다
// 아이템 꺼내기 (아이템)/(개수)/(in 아이템)/[to item] - 저장공간에서 아이템을 꺼냅니다
// 아이템 넣기 (아이템)/(개수)/(to 아이템)/[in item] - 저장공간에 아이템을 넣습니다
// 아이템 제작 (아이템)/(개수)/[조합법] - 아이템을 제작합니다
// /(숫자) - 부족한 정보를 받을 때 사용합니다


// 어드민 명령어

// 아이템 가져오기 (아이템)/(개수)/[to 아이템] - 아이템을 가져옵니다