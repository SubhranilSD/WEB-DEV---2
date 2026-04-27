import React, { useEffect, useRef, useState } from 'react'

const UseRefHook = () => {
    
    const[input,setInput] = useState("");
    // const[count,setCount] = useState(0)
    const count = useRef(0) ;
    console.log(count);

    useEffect(()=>{
        console.log("render");
        // setCount(count+1);
        count.current = count.current+1
    })

  return (
    <div>
        <input type='text' value={input} onChange={(e)=>setInput(e.target.value)}/>
        <h1>Render count:{count.current}</h1>
    </div>
  )
}

export default UseRefHook