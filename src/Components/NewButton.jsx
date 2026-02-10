import { useContext, useState } from "react";
// import { useFolder } from "../utils/FolderContext.jsx";
import { FoldContext } from "../utils/FolderContext.jsx";
import "./../Style/NewButton.css";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Popup from "./Popup.jsx";
import UploadButton from "./UploadButton.jsx";
import FolderUpload from "./FolderUpload.jsx";

export default function NewButton({ fetchFolder }) {

   const [code, setCode] = useState(0);
   const [show, setShow] = useState(false);
   const [msg, setMsg] = useState("");
   const [resourceName, setResourceName] = useState("");
   const { currentFolderId } = useContext(FoldContext);

   async function uploadFile(file, change, folderId) {

      let fName = file.name;
      let form = new FormData();
      form.append("file", file);
      form.append("filename", fName);
      form.append("folderId", folderId);
      setCode(200);
      setMsg(" ⬇ File Uploading ...");
      setShow(true);
      let res = await fetch("http://localhost:8080/WorkDrive/UploadFileServlet", {
         method: "POST",
         body: form
      })

      let data = await res.json();

      if (data.StatusCode == 200) {
         console.log("Hello from upload file success");
         showResult(data.StatusCode, "✅ File uploaded sucessfully", true);
         setShowFolderinput(false);
      }
      if (data.StatusCode >= 400) {
         console.log("Hello from upload file error");
         showResult(data.StatusCode, "❌ File upload Failed", true)
      }

   }

   async function uploadFolder(files, change, parentId) {

      const formData = new FormData();

      console.log(files);

      for (let file of files) {
         formData.append("files", file);
         console.log(file);
         console.log("files: "+file.name+" | Path"+file.webkitRelativePath);
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
         showResult(data.StatusCode, "✅ Folder created sucessfully", true);
         setShowFolderinput(false);
      }
      if (data.StatusCode >= 400) {
         showResult(data.StatusCode, "❌ Folder creation Failed", true)
      }

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
            <Button id="newButton">+ New</Button>

            <div className="dropdownMenu">
               <Button className="dropdown" onClick={() => setShowFolderinput(true)}>Create Folder</Button>
               <UploadButton onUpload={(file) => uploadFile(file, false, currentFolderId.id)} sendValue={getValue}></UploadButton>
               <FolderUpload onUpload={(files) => uploadFolder(files, false, currentFolderId.id)}></FolderUpload>
            </div>
         </div>

         <Popup result={code} msg={msg} show={show}></Popup>

         {showFolderInput && <Input placeholder="Enter the Folder Name" sendValue={getValue} submitBtn={"Create"} onClick={() => createFolder(resourceName, currentFolderId.id)} cancel={() => setShowFolderinput(false)}>Create New Folder</Input>}

      </>
   );
}
