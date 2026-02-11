// let arr=[1,2,3,4,5]
// let arr2= []
// while (arr.length>0){
//     arr2.push(arr.pop())
// }
// console.log(arr2)

let arr=[-3,7,-6,-11,13,8]
let res= []

while (arr.length>0){
    let val= arr.shift();
    if (val>0){
        res.push(val)
    }
}
console.log(res)

