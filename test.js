let arr = [1,2,2,2,4,3,1]
let obj = arr.reduce((a, v) => (a[v] ? a[v]++ : a[v] = 1, a), {})
let result = Object.keys(obj).map(v => ({[v] : obj[v]}))
let a = 1
let obj2 = {
    [a] : 1
}
console.log(obj)