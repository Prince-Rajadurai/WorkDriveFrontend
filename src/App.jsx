import { useState } from 'react'
import './App.css'
import AuthenticationContext from './utils/AuthenticationContext'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AuthenticationContext>
        <Header></Header>
      </AuthenticationContext>
    </>
  )
}

export default App
