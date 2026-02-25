import "../Style/NavBar.css";
import {useNavigate} from "react-router-dom";

export default function NavBar() {

    const navigate = useNavigate();

    return (
        <nav className="navBar">
            <div className="logo" onClick={()=>{navigate("/smartdrive/")}}>
                <img src="../src/assets/logo.png" alt="No image found" height="30px" width="35px"/>
                <h1>SmartDrive</h1>
            </div>
            <div className="buttons">
                <button className='simple-button' onClick={()=>{navigate("/smartdrive/signin")}}>Sign In</button>
                <button className='focus-button'onClick={()=>{navigate("/smartdrive/signup")}}>Get Started</button>
            </div>
        </nav>
    )
}