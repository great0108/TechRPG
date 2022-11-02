const response = require("./main")
function sleep(ms) {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}
// const UserDao = require("./Dao/UserDao")
// UserDao.update()

//response([123456], "실험방", "/명령어", "sender")
//response([123456], "실험방", "/아이템 제작 나무 판자/1/3", "sender")
//response([123456], "실험방", "/1", "sender")

console.log(1)
sleep(3000)
console.log(2)