import { useState } from 'react'
import './App.css'
import AuthenticationContext from './utils/AuthenticationContext'
import Header from './Components/Header'

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
