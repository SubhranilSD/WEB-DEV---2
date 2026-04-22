import React from 'react'
import Child from './Child'

const Parent = () => {
  const fullname = "Jaskirat Singh Rangi"
  return (
    <>
      <div>Parent</div>
      <h1>Rendered in parent comp : {fullname}</h1>
      <Child name={fullname} />
    </>
  )
}

export default Parent