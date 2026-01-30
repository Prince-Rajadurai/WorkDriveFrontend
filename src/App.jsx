import './App.css'
import ReplacePopup from './Components/ReplacePopup';
import Home from './Pages/Home'
import SignIn from './Pages/SignIn'
import SignUpPage from './Pages/SignUp'

import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      {/* <Home></Home> */}
<<<<<<< HEAD
       <Routes>
=======
       {/* <Routes>
>>>>>>> fe77f4b (Pulling updated UI)
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<SignIn/>} />
        {/* <Route path="/edit" element={<EditPage />} /> */}
<<<<<<< HEAD
        <Route path="/home" element={<Home />} />
      </Routes>
=======
        {/* <Route path="/home" element={<Home />} />
      </Routes> */}
      <ReplacePopup cancel={()=>{}}>My Folder</ReplacePopup>
>>>>>>> fe77f4b (Pulling updated UI)
    </>
  )
}

export default App