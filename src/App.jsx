import './App.css'
import ReplacePopup from './Components/ReplacePopup';
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUpPage from './Pages/SignUp'

import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      <Home></Home>
       {/* <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<SignIn/>} /> */}
        {/* <Route path="/edit" element={<EditPage />} /> */}
        {/* <Route path="/home" element={<Home />} />
      </Routes> */}
      {/* <ReplacePopup cancel={()=>{}}>My Folder</ReplacePopup> */}
    </>
  )
}

export default App