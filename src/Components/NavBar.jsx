import './../Style/NavBar.css';
export default function NavBar() {
    return (
        <nav className="navBar">
            <div className="logo">
                <img src="../src/assets/logo.png" alt="No image found" height="30px" width="35px"/>
                <h1>SmartDrive</h1>
            </div>
            <div className="buttons">
                <button className='simple-button'>Sign In</button>
                <button className='focus-button'>Get Started</button>
            </div>
        </nav>
    )
}