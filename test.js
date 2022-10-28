"use strict"
let inv = [{"나무":60},{"돌":22}, {"흙":63}]
let result = inv.map((v,i)=>{
    let returnValue = [];
    let ty = Object.keys(v)[0];
    returnValue.push(v[ty]);
    if(v[ty] > 30){
        new Array(Math.round(returnValue[0]/30)).fill(0).map(_=>returnValue.push(v[ty]));
        new Array(returnValue.length-1).fill(0).map((c,b)=>returnValue[b] = 30);
        returnValue[returnValue.length-1]-=(returnValue.length-1)*30;
    }
    returnValue.unshift(ty);
    return returnValue.join('\n');}).join('\n\n')
console.log(result)