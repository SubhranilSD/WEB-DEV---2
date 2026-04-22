import React from 'react'
import Parent from './propsPassing/Parent'
import IfElse from './ConditionalRendering/IfElse'
import Ternary from './ConditionalRendering/Ternary'
import MultipleJSX from './ConditionalRendering/MultipleJSX'
import UseStateOne from './Hooks/UseStateOne'
import ShowHide from './Hooks/ShowHide'
import DarkLight from './Hooks/DarkLight'
import WindowResize from './Hooks/WindowResize'
import LetterCount from './Hooks/LetterCount'
import DataFetching from './Hooks/FetchAPI'
import Timer from './Hooks/SetTimer'


const App = () => {
  return (
    <div>
      <Parent />
      <IfElse />
      <Ternary />
      <MultipleJSX />
      <UseStateOne />
      <ShowHide />
      <DarkLight />
      <WindowResize />
      <LetterCount />
      <DataFetching />
      <Timer />
    </div>
  )
}

export default App