import { RiFileUploadLine } from "react-icons/ri";

import '../Style/UploadButton.css';

export default function UploadButton({onUpload}){
    return(
        <>
            <label htmlFor="upload_btn" className='btn-upload'>
            <RiFileUploadLine size={25} />
                Upload Files
            </label>
            <input type="file" id="upload_btn" onChange={(e) => {const file = Array.from(e.target.files);onUpload(file);e.target.value = null;}} hidden multiple/>
        </>
    );
}