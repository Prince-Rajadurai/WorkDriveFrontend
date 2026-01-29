import './App.css'
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUpPage from './Pages/SignUp'

import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
       <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<SignIn/>} />
        {/* <Route path="/edit" element={<EditPage />} /> */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  )
}

export default App