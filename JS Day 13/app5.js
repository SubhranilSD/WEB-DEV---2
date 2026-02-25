let pro = new Promise((resolve, reject) => {
    let proposal = "false"
    if (proposal == "true") {
        resolve()
    }
    else {
        reject()
    }
    pro.then(() => console.log("proposal accepted"))
        .catch(() => console.log("proposal rejected"))

})
