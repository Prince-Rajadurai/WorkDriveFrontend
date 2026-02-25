import './App.css';
import ReplacePopup from './Components/ReplacePopup';
import Home from './Pages/Home';
import SignIn from './Pages/SignIn';
import SignUpPage from './Pages/SignUp';
import LandingPage from './Pages/LandingPage';

import { Routes, Route } from "react-router-dom";

function App() {

  return (
    <>
      {/* <Home></Home> */}
       <Routes>
        <Route path="/smartdrive/signup" element={<SignUpPage />} />
        <Route path="/smartdrive/signin" element={<SignIn/>} />
        <Route path="/smartdrive/home" element={<Home />} />
        <Route path="/smartdrive/" element={<LandingPage/>} />
      </Routes>
    </>
  )
}

export default App