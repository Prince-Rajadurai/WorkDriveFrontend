import "../Style/Footer.css"
export default function Footer() {
    return (
        <footer className="footer">
            <div className="content">
                <div className="footerLogo">
                    <img src="../src/assets/logo.png" alt="No image found" height="25px" width="30px" />
                    <h1>SmartDrive</h1>
                </div>
                <p>Building the foundations of high-performance cloud infrastructure for the next generation of enterprise software</p>
            </div>
            <p className="footer-copyrights">© SmartDrive Infrastructure all rights reserved</p>
        </footer>
    )
}