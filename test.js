const sqlite3 = require('sqlite3').verbose();

let mapType = [1,2,3,4,5,6,7,8,9]

Map = function() {
    this.map = {}
}
Map.prototype.make = function(type, coord) {
    let name = this.name(type)
    this.map[name] = {coord : coord, type : type}
}
Map.prototype.name = function(type) {
    let i = 1
    while(this.map[String(type) + i]) {
        i++
    }
    return String(type) + i
}
Map.prototype.nearPlace = function(coord) {
    let result = []
    for(let name in this.map) {
        let c = this.map[name].coord
        if(this.distance(coord, c) == 1) {
        result.push(this.map[name])
        }
    }
    return result
}
Map.prototype.distance = function(c1, c2) {
    return Math.pow((c1[0] - c2[0]), 2) + Math.pow((c1[1] - c2[1]), 2)
}
Map.prototype.moveWay = function(start, end) {
    if(start[0] === end[0]) {
      return Array( Math.abs(start[1] - end[1])+1 ).fill()
            .map((v, i) => [start[0], start[1]+(start[1] < end[1] ? i : -i)])
    }
    let isReverse = false
    if(start[0] > end[0]) {
      let temp = start
      start = end
      end = temp
      isReverse = true
    }
    let dx = end[0] - start[0]
    let dy = end[1] - start[1]
    let ratio = dy/dx
    let result = []
    let lastY = 0
    for(let i = 0; i <= dx; i++) {
      let y = Math.round(ratio * Math.min((i+0.5), dx))
      for(let j = lastY; dy > 0 ? j <= y : j >= y; dy > 0 ? j++ : j--) {
        result.push([start[0]+i, start[1]+j])
      }
      lastY = y
    }
    return isReverse ? result.reverse() : result
}
Map.prototype.random = function() {
    return mapType[Math.random() * mapType.length | 0]
}
Map.prototype.selectType = function(coord) {
    let near = this.nearPlace(coord)
    let random = Math.random() * 2 | 0
    if(random < near.length) {
        return near[random].type
    } else {
        return this.random()
    }
}
Map.prototype.isExistCoord = function(coord) {
    return Object.keys(this.map).some(v => this.map[v].coord[0] === coord[0] && this.map[v].coord[1] === coord[1])
}
Map.prototype.explore = function(start, end) {
    let coords = this.moveWay(start, end)
    for(let coord of coords) {
        if(this.isExistCoord(coord)) {
            continue
        }
        let type = this.selectType(coord)
        this.make(type, coord)
    }
}

console.log(2>1 ? (console.log(1),console.log(2)) : console.log(3))