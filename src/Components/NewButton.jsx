import "./../Style/NewButton.css";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { useState } from "react";
import Popup from "./Popup.jsx";

export default function NewButton() {

   const[code , setCode] = useState(0);
   const[show , setShow] = useState(false);
   const[msg , setMsg] = useState("");


   function createFile() {
        setCode(200);
        setMsg("✅ File created sucessfully");
        setShow(true);
        setTimeout(()=>{setShow(false)},2000)
   }

   async function createFolder(folderName) {

      if (!folderName) return;

      const response = await fetch("http://localhost:8080/WorkDrive/FolderAddServlet", {
         method: "POST",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({
            resourceName: folderName,
            parentId: null
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

         {showFileInput && <Input placeholder="Enter the File Name" onClick={createFile} cancel={()=>setShowFileinput(false)}>File</Input>}
      </>
   );
}
