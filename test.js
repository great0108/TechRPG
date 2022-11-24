const sqlite3 = require('sqlite3').verbose();

let obj = {

    a : '123',
  
    b : '234',
  
    c : '123',
  
    d : '234'
  
}

let temp = Object.keys(obj).reduce((a, v) => ((obj[v] in a ? a[obj[v]].push(v) : a[obj[v]] = [v]), a), {})
let result = Object.keys(temp).reduce((a, v) => (a[temp[v]] = v, a), {})
console.log(result)