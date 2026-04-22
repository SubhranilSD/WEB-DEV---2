import React, { useState } from 'react'

const UseStateOne = () => {

    const [count, setCount] = useState(0);
    const [num, setNum] = useState(0);

    useEffect(() => {
        alert("button clicked , useEffect is working");
    }, [count])  // count is the dependency of useeffect, HENCE USE EFFECT BAS  count pe kaam karega


    console.log()

    function increase() {
        setCount(count + 1) //will update the count value
    }

    function decrease() {
        setCount(count - 1) //will update the count value
    }

    console.log("render")
    return (
        <>
            <div><h2>UseStateOne</h2></div>
            Count:{count}
            <button onClick={increase}>Click Crow</button>
            <button onClick={decrease}>Click Crow</button>

            <h1>NUM:{num}</h1>
            <button onClick={() => setNum(num + 1)}>Increase</button>

        </>

    )
}

export default UseStateOne