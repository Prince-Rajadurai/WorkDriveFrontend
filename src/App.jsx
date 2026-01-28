import { useState } from 'react'
import './App.css'
import NewButton from './Components/NewButton'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NewButton>+ New</NewButton>
    </>
  )
}

export default App
