import "../Style/LandingPage.css";
import Header from "./Header";
import Footer from "./Footer";
export default function DetailsPage() {
    return (
        <>
            <Header />


            <main className="landing-section-1">
                <div className="landing-content">
                    <h1 className="landing-heading">Scale your data
                        <br />
                        <span className="color-content">without limits</span>
                    </h1>
                    <p className="landing-main-descriptions" style={{ width: "90%" }}>SmartDrive delivers high-performance, intelligent storage solutions designed for the modern enterprise. Optimize infrastructure and reduce costs by up to 65%</p>
                    <div>
                        <button className="focus-button large-size">Start SmartDrive Now</button>
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
                    <p className="landing-descriptions">Industry-leading lossless compression using machine learning models to identify and reduce redunancies at the byte level.</p>
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
                    <button className="simple-button-go">Let's go ➜</button>
                </div>
                <div className="landing-content">
                    <div className="landing-image-container"><img src="../src/assets/graph.png" alt="image not found" className="landing-images" /></div>
                </div>
            </main>


            <Footer />
        </>
    );
}