import '../Style/UploadButton.css'

export default function UploadButton(){
    return(
        <>
            <label htmlFor="upload_btn">Upload File</label>
            <input type="file" id="upload_btn" hidden/>
        </>
    );
}