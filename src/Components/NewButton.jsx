import { useContext, useState } from "react";
// import { useFolder } from "../utils/FolderContext.jsx";
import { FaPlus } from "react-icons/fa";
import { FiFolderPlus } from "react-icons/fi";
import { FoldContext } from "../utils/FolderContext.jsx";
import "./../Style/NewButton.css";
import Button from "./Button.jsx";
import FolderUpload from "./FolderUpload.jsx";
import Input from "./Input.jsx";
import Popup from "./Popup.jsx";
import UpdateFile from "./UpdateFile.jsx";
import UploadButton from "./UploadButton.jsx";

export default function NewButton({ fetchFolder }) {

   const [code, setCode] = useState(0);
   const [show, setShow] = useState(false);
   const [msg, setMsg] = useState("");
   const [resourceName, setResourceName] = useState("");
   const { currentFolderId } = useContext(FoldContext);

   const [showUpdateFile , setShowUpdateFile] = useState(false);

   const [fileObject , setFileObject] = useState({});
   const [getFolderId , setFolderId] = useState({});



   async function uploadFile(file, change, folderId) {

      let fName = file.name;
      let fileSize = file.size;
      let form = new FormData();
      form.append("file", file);
      form.append("filename", fName);
      form.append("folderId", folderId);
      form.append("replaceFile" , change);
      form.append("size" , fileSize);
      setCode(200);
      setMsg(" ⬇ File Uploading ...");
      setShow(true);
      let res = await fetch("http://localhost:8080/WorkDrive/secure/UploadFileServlet", {
         method: "POST",
         credentials: "include",
         body: form
      })
      let data = await res.json();

      if (data.StatusCode == 200) {
         showResult(data.StatusCode, "✅ "+data.message, true);
         setShowFolderinput(false);
      }
      if (data.StatusCode >= 400) {
         if(data.message == "File already exists"){
            setShow(false);
            setFileObject(file);
            setFolderId(folderId);
            setShowUpdateFile(true);
         }
         else{
            showResult(data.StatusCode, "❌ File upload Failed", true)
         }
      }

   }

   async function uploadFolder(files, change, parentId) {

      const formData = new FormData();

      for (let file of files) {
         formData.append("files", file);
      }

      formData.append("parentId",parentId);

      setCode(200);
      setMsg(" ⬇ Folder Uploading ...");
      setShow(true);

      let res = await fetch("http://localhost:8080/WorkDrive/FolderUploadServlet", {
         method: "POST",
         credentials:"include",
         body: formData,
      })

      let data = await res.json();

      if (data.StatusCode == 200) {
         showResult(data.StatusCode, "✅ Folder uploaded sucessfully", true);
         setShowFolderinput(false);
      }
      if (data.StatusCode >= 400) {
         showResult(data.StatusCode, "❌ Folder upload Failed", true)
      }

   }

   async function createFolder(folderName, parentId) {
      if (!folderName) return;

      const response = await fetch("http://localhost:8080/WorkDrive/FolderServlet", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         credentials: "include",
         body: JSON.stringify({
            resourceName: folderName,
            parentId,
         })
      });

      const data = await response.json();

      if (data.StatusCode == 200) {
         setResourceName("");
         showResult(data.StatusCode, "✅ Folder created sucessfully", true);
         setShowFolderinput(false);
      }
      if (data.StatusCode >= 400) {
         showResult(data.StatusCode, "❌ Folder creation Failed", true)
      }

   }

   function skipFile(){
      setShowUpdateFile(false);
   }

   function updateFile(){

      setShowUpdateFile(false);
      uploadFile(fileObject , true , getFolderId);
      
   }

   function showResult(Code, msg, chk) {
      fetchFolder(currentFolderId.id);
      setCode(Code);
      setMsg(msg);
      setShow(chk);
      setTimeout(() => { setShow(false) }, 2000)
   }

   function getValue(name) {
      setResourceName(name);
   }

   const [showFolderInput, setShowFolderinput] = useState(false);
   const [showFileInput, setShowFileinput] = useState(false);


   return (
      <>
         <div className="newButtonBox">
            <Button id="newButton"><FaPlus/> New</Button>

            <div className="dropdownMenu">
               <Button className="dropdown" onClick={() => setShowFolderinput(true)}><FiFolderPlus size={23}/>Create Folder</Button>
               <UploadButton onUpload={(file) => uploadFile(file, false, currentFolderId.id)} ></UploadButton>
               <FolderUpload onUpload={(files) => uploadFolder(files, false, currentFolderId.id)}></FolderUpload>
            </div>
         </div>

         <Popup result={code} msg={msg} show={show}></Popup>
         {showUpdateFile && <UpdateFile update = {updateFile} skip = {skipFile}></UpdateFile>}

         {showFolderInput && <Input placeholder="Enter the Folder Name" sendValue={getValue} submitBtn={"Create"} onClick={() => createFolder(resourceName, currentFolderId.id)} cancel={() => setShowFolderinput(false)}>Create New Folder</Input>}

      </>
   );
}
