const sqlite3 = require('sqlite3').verbose();

binarySearch = function(list, target, type) {
let left = 0
let right = list.length-1
while(left <= right) {
let mid = (left+right) / 2 | 0
if(list[mid] > target) {
right = mid - 1
} else if(list[mid] < target) {
left = mid + 1
} else {
if(type == "left") {
if(list[mid-1] !== target) {
return mid
}
right = mid - 1
} else if(type == "right") {
if(list[mid+1] !== target) {
    return mid
}
left = mid + 1
}
}
}
return Math.max(left, right)
}

let arr = [0,0,0,1,1,2,2,2,2,3,3,4,4,4,4,6,8,10]
console.log(binarySearch(arr, 4, "right"))