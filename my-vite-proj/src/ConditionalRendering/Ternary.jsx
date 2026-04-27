import React from 'react'

const Ternary = () => {

    const isLoggenin = true;

    useEffect(() => {
      first
    
      return () => {
        second
      }
    }, [third])
    

    return (
        <>
            <div>Ternary</div>
            <h1>{isLoggenin ? "Dashboard Access given" : "Access denied in Kasainuma fashion"}</h1>
        </>
    )
}

export default Ternary