import React from 'react'

const IfElse = () => {
    let msg;
    const age = 10;
    if (age > 18) {
        msg = "vote"
    }
    else {
        msg = "not eligible to vote"
    }
    return (
        <>
            <div>IfElse</div>
            <h1>{msg}</h1>
        </>
    )
}

export default IfElse