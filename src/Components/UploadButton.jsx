import '../Style/UploadButton.css'

export default function UploadButton({sendValue}){
    return(
        <>
            <label htmlFor="upload_btn" className='btn-upload'>Upload File</label>
            <input type="file" id="upload_btn" onChange={(e)=>{sendValue(e.target.value)}} hidden/>
        </>
=======
export default function UploadButton({sendValue}){
    return(
        <input type="file" value ="Upload File" on/>
>>>>>>> 0630b78 (pull the code)
    );
}