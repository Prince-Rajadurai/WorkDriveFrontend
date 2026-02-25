import { RiFolderUploadLine } from "react-icons/ri";
import './../Style/UploadButton.css';

export default function FolderUpload({onUpload}){
    return(
        <>
            <label htmlFor="folder-upload" className="btn-upload">
                <RiFolderUploadLine size={25}/>
                Upload Folder
                </label>
            <input type="file" id="folder-upload" webkitdirectory="" directory="" onChange={(e) => { if (!e.target.files.length) return; onUpload(e.target.files);e.target.value = null;}} hidden />
        </>
    );
}