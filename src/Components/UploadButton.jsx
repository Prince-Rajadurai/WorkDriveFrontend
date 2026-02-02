import '../Style/UploadButton.css';

export default function UploadButton({sendValue}){
    return(
        <>
            <label htmlFor="upload_btn" className='btn-upload'>Upload File</label>
            <input type="file" id="upload_btn" onChange={(e)=>{sendValue(e.target.value)}} hidden/>
        </>
    );
}