import '../Style/UploadButton.css';

export default function FolderUpload(){
    return(
        <>
            <label htmlFor="folder-upload" className="btn-upload">Upload Folder</label>
            <input type="file" id="folder-upload" webkitdirectory directory onChange={(e) => { if (!e.target.files.length) return; onUpload(e.target.files);}} hidden />
        </>
    );
}