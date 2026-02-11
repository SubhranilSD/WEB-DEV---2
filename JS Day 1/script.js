let arr=[1,2,3,4,5]

let res= arr.reduce((acc, curr)=>{
    return acc + curr;
},0);
console.log(res);