const response = require("./main")
function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

// response([123456], "실험방", "/명령어", "sender")
// response([123456], "실험방", "/회원가입", "sender")
// response([123456], "실험방", "/내정보", "sender")
// response([123456], "실험방", "/인벤정보", "sender")
// response([123456], "실험방", "/맵정보", "sender")

// response([123456], "실험방", "/아이템 수집 풀/3", "sender")
// sleep(3000)
// response([123456], "실험방", "/아이템 버리기 풀/3", "sender")
// response([123456], "실험방", "/아이템 회수 풀/3/세라믹 항아리1", "sender")
// response([123456], "실험방", "/아이템 넣기 풀/3/세라믹 항아리1", "sender")
// response([123456], "실험방", "/아이템 꺼내기 풀/6/세라믹 항아리1", "sender")
// response([123456], "실험방", "/아이템 제작 끈/1", "sender")

// response([123456], "실험방", "/아이템 가져오기 나무/2", "sender")
// response([123456], "실험방", "/아이템 제작 나무 판자/2", "sender")
// sleep(1000)
// response([123456], "실험방", "/1", "sender")

// response([123456], "실험방", "/아이템 정보 세라믹 항아리", "sender")
// response([123456], "실험방", "/아이템 정보 돌 도끼", "sender")
// response([123456], "실험방", "/아이템 정보 물", "sender")
// response([123456], "실험방", "/제작 정보 나무 판자", "sender")

// response([123456], "실험방", "/글 쓰기 테스트\n테스트 글 입니다", "sender")
// response([123456], "실험방", "/글 목록", "sender")
// response([123456], "실험방", "/글 검색 테스트", "sender")
// response([123456], "실험방", "/글 읽기 테스트", "sender")
// response([123456], "실험방", "/글 추가 테스트\n글 추가", "sender")
// response([123456], "실험방", "/글 삭제 테스트", "sender")
// response([123456], "실험방", "/글 목록", "sender")

response([123456], "실험방", "/아이템 제작 돌 곡괭이/1", "sender")
response([123456], "실험방", "/기구 설치 조합대", "sender")
response([123456], "실험방", "/아이템 제작 돌 곡괭이/1", "sender")
response([123456], "실험방", "/기구 회수 조합대", "sender")

// response([123456], "실험방", "/아이템 목록", "sender")

//response([123456], "실험방", "/아이템 제작 막대기/4", "sender")