import { useState, useContext } from "react";
// import { useFolder } from "../utils/FolderContext.jsx";
import "./../Style/NewButton.css";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Popup from "./Popup.jsx";
import UploadButton from "./UploadButton.jsx";
import { FoldContext } from "../utils/FolderContext.jsx";

export default function NewButton({fetchFolder}) {

   const[code , setCode] = useState(0);
   const[show , setShow] = useState(false);
   const[msg , setMsg] = useState("");
   const[resourceName , setResourceName] = useState("");
   const{ currentFolderId } = useContext(FoldContext);


   async function createFile(filename , change , folderId){


      let response = await fetch("http://localhost:8080/WorkDrive/creation/CreateFileServlet" , {
         method : "POST",
         headers : {"Content-Type" : "application/json"},
         body : JSON.stringify({filename,change, folderId })
      });
      let data = await response.json();

      if(data.StatusCode == 200){
         setShowFileinput(false);
         fetchFolder(folderId);
         setCode(200);
         setMsg("✅ File created successfully");
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

   

   async function uploadFile(localfile , change , folderId){

      
      let filename = localfile.name;
      
      const reader = new FileReader();

      reader.onload = async function () {

         console.log("hii");
         const base64Data = reader.result.split(",")[1];
         
         let response = await fetch("http://localhost:8080/WorkDrive/creation/UploadFileServlet" , {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
            body : JSON.stringify({filename,change,folderId ,data:base64Data})
         });
         let data = await response.json();

         if(data.StatusCode == 200){
            showResult(data.StatusCode , "✅ File created sucessfully" , true)
         }
         if(data.StatusCode >= 400){
            showResult(data.StatusCode , "❌ File creation Failed" , true)
         }
         
     };

     reader.readAsDataURL(file);

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
         showResult(data.StatusCode , "✅ Folder created sucessfully" , true);
         setShowFolderinput(false);
      }
      if(data.StatusCode >= 400){
         showResult(data.StatusCode , "❌ Folder creation Failed" , true)
      }

   }

   function showResult(Code , msg , chk){
      fetchFolder(currentFolderId.id);
      setCode(Code);
      setMsg(msg);
      setShow(chk);
      setTimeout(()=>{setShow(false)},2000)
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
               <UploadButton onClick = {()=>{uploadFile(resourceName,false,currentFolderId.id)}} sendValue = {getValue}></UploadButton>
            </div>
         </div>

         <Popup result={code} msg={msg} show={show}></Popup>

         {showFolderInput && <Input placeholder="Enter the Folder Name" sendValue = {getValue} onClick={()=>createFolder(resourceName,currentFolderId.id)} cancel={()=>setShowFolderinput(false)}>Create New Folder</Input>}

         {showFileInput && <Input placeholder="Enter the File Name" sendValue = {getValue} onClick={()=>{createFile(resourceName,false,currentFolderId.id)}} cancel={()=>setShowFileinput(false)}>Create New File</Input>}
      </>
   );
}
