import { FaExclamationCircle } from "react-icons/fa";
import '../Style/RestorePopup.css';

export default function RestorePopup({replace , skip}){
    return(
        <>
            <div className="restorePopup-main">
                <div className="restore-container">
                    <div className="restore-heading">
                        <FaExclamationCircle size={30} className="exclamation"/>
                        <h2>Restore</h2>
                    </div>
                    <div className="restore-description">
                        <p>Folder not found — the file has been restored to the root directory.</p>
                    </div>
                    <div className="restore-btn">
                        <button className="restore-skip" onClick={skip}>Skip</button>
                        <button className="restore-replace" onClick={replace}>Replace</button>
                    </div>
                </div>
            </div>
        </>
    );
}