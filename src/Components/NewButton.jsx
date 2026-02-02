import { useState } from "react";
import { useFolder } from "../utils/FolderContext.jsx";
import "./../Style/NewButton.module.css";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Popup from "./Popup.jsx";
import UploadButton from "./UploadButton.jsx";

export default function NewButton({fetchFolder}) {

   const[code , setCode] = useState(0);
   const[show , setShow] = useState(false);
   const[msg , setMsg] = useState("");
   const[resourceName , setResourceName] = useState("");
   const{ currentFolderId } = useFolder();


   async function createFile(filename , change , folderId){


      let response = await fetch("http://localhost:8080/WorkDrive/creation/CreateFileServlet" , {
         method : "POST",
         headers : {"Content-Type" : "application/json"},
         body : JSON.stringify({filename,change, folderId })
      });
      let data = await response.json();

      if(data.StatusCode == 200){
         fetchFolder(folderId);
         setCode(200);
         setMsg("✅ File created sucessfully");
         setShow(true);
         setTimeout(()=>{setShow(false)},2000)
      }
      if(data.StatusCode == 400){
         setCode(400);
         setMsg("❌ File creation Failed");
         setShow(true);
         setTimeout(()=>{setShow(false)},2000)
      }
      else{
         console.log(data.StatusCode);
      }

   }

   async function createFolder(folderName,parentId) {

      if (!folderName) return;

      const response = await fetch("http://localhost:8080/WorkDrive/FolderAddServlet", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         credentials: "include",
         body: JSON.stringify({
            resourceName:folderName,
            parentId,
         })
      });

      const data = await response.json();


      if(data.StatusCode == 200){
         fetchFolder(parentId);
         setCode(200);
         setMsg("✅ Folder created sucessfully");
         setShow(true);
         setTimeout(()=>{setShow(false)},2000)
      }
      if(data.StatusCode == 400){
         setCode(400);
         setMsg("❌ Folder creation Failed");
         setShow(true);
         setTimeout(()=>{setShow(false)},2000)
      }
      else{
         console.log(data.StatusCode);
      }


      console.log("Server response:", data);
   }

   function getValue(name){
      setResourceName(name);
   }

   const [showFolderInput, setShowFolderinput] = useState(false);
   const [showFileInput, setShowFileinput] = useState(false);


   return (
      <>
         <div className="newButtonBox">
            <Button id="newButton">+ New</Button>

            <div className="dropdownMenu">
               <Button className="dropdown" onClick={()=>setShowFileinput(true)}>Create File</Button>
               <Button className="dropdown" onClick={()=>setShowFolderinput(true)}>Create Folder</Button>
               {/* <Button className="dropdown" onClick={() => {}}>Upload File</Button> */}
               <UploadButton className="dropdown"></UploadButton>
            </div>
         </div>

         <Popup result={code} msg={msg} show={show}></Popup>

         {showFolderInput && <Input placeholder="Enter the Folder Name" sendValue = {getValue} onClick={()=>createFolder(resourceName,null)} cancel={()=>setShowFolderinput(false)}>Folder</Input>}

         {showFileInput && <Input placeholder="Enter the File Name" sendValue = {getValue} onClick={()=>{createFile(resourceName,false,"805297374409785344")}} cancel={()=>setShowFileinput(false)}>File</Input>}
      </>
   );
}
