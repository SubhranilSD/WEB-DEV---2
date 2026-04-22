import React from 'react'

const Child = ({ name }) => {

  const fullname = "Subhranil";

  return (
    <>
      <div> child</div>
      <h1>Rendered in child comp: {name}</h1>

    </>
  )
}

export default Child