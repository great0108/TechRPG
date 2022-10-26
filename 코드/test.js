const response = require("./main")
const UserDao = require("./Dao/UserDao")

// let user = UserDao.read("123456")
// user.inven = []
// UserDao.write("123456", user)
// UserDao.save()

response("", "실험방", "/아이템 버리기 흙/1/세라믹 항아리1", "sender")

// 버전 : 0.0.2

// 명령어 목록

// 회원가입 - 회원가입을 함
// 명령어 - 명령어 목록을 띄움
// 내정보 - 내정보 창을 띄움
// 인벤정보 - 인벤정보 창을 띄움
// 맵정보 - 맵정보 창을 띄움
// 아이템 수집 (아이템) (개수) [with item] - 아이템을 수집 함
// 아이템 버리기 (아이템) (개수) [in 아이템] - 아이템을 버림
// 아이템 회수 (아이템) (개수) [with item] - 버린 아이템을 수집 함
// 아이템 꺼내기 (아이템) (개수) (in 아이템) [with item] - 저장공간에서 아이템을 꺼냄
// 아이템 넣기 (아이템) (개수) (to 아이템) [in item] - 저장공간에 아이템을 넣음

// 테스트 명령어
// 아이템 가져오기 (아이템) (개수) [with item]