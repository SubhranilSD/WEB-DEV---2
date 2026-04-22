import React from 'react'
import { useState } from 'react'
const DarkLight = () => {
    const [dark, setDark] = useState(false);

    return (

        <>
            <div>DarkLight</div>
            <div style={{ backgroundColor: dark ? "black" : "white", color: dark ? "white" : "black" }}>
                <h1>{dark ? "Dark Mode" : "Light Mode"}</h1>
                <button onClick={() => setDark(!dark)}>Toggle Theme</button>
            </div>
        </>
    )
}

export default DarkLight