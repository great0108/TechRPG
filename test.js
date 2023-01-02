const sqlite3 = require('sqlite3').verbose();

str = "사과 +123 바나나 +512 키위 +512"
let a = str.replace(/[가-힣]+\s\+\d+\s/g, v => v.slice(0, -1) + "\n")
console.log(str)
let b = "as[]".replace(/\[]/, '')
console.log(b)
