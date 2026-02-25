console.log('Starting...')
function doWork(cb) {
    setTimeout(() => {
        cb('Working..');
    }, 2000)
}
doWork((data) => {
    console.log(data)
})
console.log('Ending')

// console.log('Starting...')
// function doWork() {
//     setTimeout(() => {
//         return 'Working..'
//     }, 2000)
// }
// console.log(doWork())
// console.log('Ending')