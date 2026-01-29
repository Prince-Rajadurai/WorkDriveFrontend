import { useState } from "react";
import "./../Style/NewButton.css";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import Popup from "./Popup.jsx";

export default function NewButton() {

   const[code , setCode] = useState(0);
   const[show , setShow] = useState(false);
   const[msg , setMsg] = useState("");
   const[filename , useFilename] = useState("");


   async function createFile(filename , path , change , folderId){

      let response = await fetch("http://localhost:8080/WorkDrive/creation/CreateFileServlet" , {
         method : "POST",
         headers : {"Content-Type" : "application/json"},
         body : JSON.stringify({filename , path , change , folderId })
      });
      let data = await response.json();

      if(data.statusCode == 200){
         setCode(200);
         setMsg("✅ File created sucessfully");
         setShow(true);
         setTimeout(()=>{setShow(false)},2000)
      }
      if(data.statusCode == 400){
         setCode(400);
         setMsg("❌ File creation Failed");
         setShow(true);
         setTimeout(()=>{setShow(false)},2000)
      }
      else{
         console.log(data.statusCode);
      }

   }

   async function createFolder(folderName,parentId) {

      if (!folderName) return;

      const response = await fetch("http://localhost:8080/WorkDrive/FolderAddServlet", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            resourceName: folderName,
            parentId: parentId,
         })
      });

      const data = await response.json();

      console.log("Server response:", data);
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
               <Button className="dropdown" onClick={() => {}}>Upload File</Button>
            </div>
         </div>

         <Popup result={code} msg={msg} show={show}></Popup>

         {showFolderInput && <Input placeholder="Enter the Folder Name" onClick={createFolder} cancel={()=>setShowFolderinput(false)}>Folder</Input>}

         {showFileInput && <Input placeholder="Enter the File Name" onClick={()=>{createFile()}} cancel={()=>setShowFileinput(false)}>File</Input>}
      </>
   );
}
