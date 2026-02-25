import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer.jsx";
import Header from "../Components/NavBar.jsx";
import "../Style/LandingPage.css";

export default function DetailsPage() {

    const navigate = useNavigate();

    useEffect(()=>{
        sessionCheck();
    },[]);
    
    async function sessionCheck(){
        try {
            const response = await fetch("http://localhost:8080/WorkDrive/SessionCheckFilter",{method: "GET",
            credentials: "include"});
            const data = await response.json();
            if (data.message !== "Session exsist") {
                navigate("/smartdrive/");
            }else{
                navigate("/smartdrive/home");
            }

        } catch (err) {
            console.log("Technical Issue");
        }
    }


    return (
        <div className="landing-page">
            <Header />


            <main className="landing-section-1">
                <div className="landing-content">
                    <h1 className="landing-heading">Scale your data
                        <br />
                        <span className="color-content">without limits</span>
                    </h1>
                    <p className="landing-main-descriptions" style={{ width: "90%" }}>SmartDrive delivers high-performance, intelligent storage solutions designed for the modern enterprise. Optimize infrastructure and reduce costs up to 65%</p>
                    <div>
                        <button className="simple-button-go" onClick={()=>{navigate("/smartdrive/signin")}}>Start SmartDrive Now</button>
                    </div>
                </div>
                <div className="landing-content">
                    <div className="landing-image-container"><img src="../src/assets/dashboard.png" alt="image not found" className="landing-images" /></div>
                </div>
            </main>


            <main className="landing-section-2">
                <div className="landing-cards">
                    <h3 className="landing-card-heading">Compress</h3>
                    <h4 className="landing-subheading">Neural Compression</h4>
                    <p className="landing-descriptions">Industry-leading intact compression using machine learning models to identify and reduce redundancies at the byte level.</p>
                </div>
                <div className="landing-cards">
                    <h3 className="landing-card-heading">Update</h3>
                    <h4 className="landing-subheading">Infinte Update</h4>
                    <p className="landing-descriptions">Zero-cost versioning allows you to traverse the history of any object without duplicating underlying storage costs.</p>
                </div>
                <div className="landing-cards">
                    <h3 className="landing-card-heading">Hub</h3>
                    <h4 className="landing-subheading">Global Deduplication</h4>
                    <p className="landing-descriptions">Unified namespace across all regions, automatically merging identical data assets to ensure maximum cost efficiency.</p>
                </div>
            </main>


            <main className="landing-section-3">
                <div className="landing-content">
                    <h3 className="landing-subheading" style={{ fontSize: "40px", fontWeight: "600" }}>Platform Performance</h3>
                    <p className="landing-main-descriptions" style={{width:"70%"}}>Our storage engine optimizes traffic in real-time. Experience a significant reduction in storage overheads as your data grows.
                    </p>
                    <div className="landing-percet-container">
                        <div>
                            <h3 className="landing-percent-1  landing-percent">88%</h3>
                            <p className="landing-main-descriptions">EFFICIENCY GAIN</p>
                        </div>
                        <div>
                            <h3 className="landing-percent-2 landing-percent">2ms</h3>
                            <p className="landing-main-descriptions">MEDIAN LATENCY</p>
                        </div>
                    </div>
                    <div style={{display:"flex"}}>
                    <button className="simple-button-go"  onClick={()=>{navigate("/smartdrive/signup")}}>Let's go ➜</button>
                    </div>
                </div>
                <div className="landing-content">
                    <div className="landing-image-container"><img src="../src/assets/graph.png" alt="image not found" className="landing-images" /></div>
                </div>
            </main>


            <Footer />
        </div>
    );
}