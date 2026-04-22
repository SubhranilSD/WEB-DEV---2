import React from 'react'

const Child = ({name}) => {

    const fullname="Pranav Nailwal";

  return (
    <>
    <div> child</div>
    <h1>rendered in child comp: {name}</h1>
    
    </>
  )
}

export default Child