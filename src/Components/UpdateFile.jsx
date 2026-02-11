import '../Style/UpdateFile.css';
import SkipButton from './SkipButton';
import UpdateButton from './UpdateButton';
export default function UpdateFile({update , skip}) {

    return (

        <>
            <div className="main-update-file">

                <div className="update-file-container">

                    <div className="update-file-describtion">

                        <div className="update-file-icon">
                            <img src="../../public/letter-i.png" alt="update-file-icon" className="update-file-img"/>
                                <h2>Upload options</h2>
                        </div>

                        <div className="update-file-txt">
                            <p>One or more items you're uploading already exist in this location. What would you like to do?</p>
                        </div>

                    </div>

                    <div className="update-file-buttons">
                        <SkipButton skipOnClick = {skip}></SkipButton>
                        <UpdateButton updateOnClick = {update}></UpdateButton>
                    </div>

                </div>

            </div>
        </>

    );

}