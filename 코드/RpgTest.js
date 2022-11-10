const response = require("./main")
function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

response([123456], "실험방", "/명령어", "sender")
response([123456], "실험방", "/회원가입", "sender")
response([123456], "실험방", "/내정보", "sender")
response([123456], "실험방", "/인벤정보", "sender")
response([123456], "실험방", "/맵정보", "sender")

response([123456], "실험방", "/아이템 수집 풀/3", "sender")
sleep(3000)
response([123456], "실험방", "/아이템 버리기 풀/3", "sender")
response([123456], "실험방", "/아이템 회수 풀/3/세라믹 항아리1", "sender")
response([123456], "실험방", "/아이템 넣기 풀/3/세라믹 항아리1", "sender")
response([123456], "실험방", "/아이템 꺼내기 풀/6/세라믹 항아리1", "sender")
response([123456], "실험방", "/아이템 제작 끈/1", "sender")

response([123456], "실험방", "/아이템 가져오기 나무/2", "sender")
response([123456], "실험방", "/아이템 제작 나무 판자/2", "sender")
sleep(500)
response([123456], "실험방", "/1", "sender")

