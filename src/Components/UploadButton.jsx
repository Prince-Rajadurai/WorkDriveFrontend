import '../Style/UploadButton.css';

export default function UploadButton({onUpload}){
    return(
        <>
            <label htmlFor="upload_btn" className='btn-upload'>Upload File</label>
            <input type="file" id="upload_btn" onChange={(e) => {const file = e.target.files[0];onUpload(file);e.target.value = null;}} hidden/>
        </>
    );
}