import React from 'react'
import Child from './Child'

const Parent = () => {
    const fullname ="Neymar Jr"
  return (
    <>
    <div>Parent</div>
    <h1>Render in parent comp{fullname}</h1>
    <Child name={fullname}/>
    </>
  )
}

export default Parent