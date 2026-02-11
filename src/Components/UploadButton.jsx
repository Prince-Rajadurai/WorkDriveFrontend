import { MdOutlineUploadFile } from "react-icons/md";
import '../Style/UploadButton.css';

export default function UploadButton({onUpload}){
    return(
        <>
            <label htmlFor="upload_btn" className='btn-upload'>
            <MdOutlineUploadFile size={25} />
                Upload File
            </label>
            <input type="file" id="upload_btn" onChange={(e) => {const file = e.target.files[0];onUpload(file);e.target.value = null;}} hidden/>
        </>
    );
}