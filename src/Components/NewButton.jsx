import { useContext, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiFolderAddLine } from "react-icons/ri";
import { FoldContext } from "../utils/FolderContext.jsx";
import "./../Style/NewButton.css";
import Button from "./Button.jsx";
import FolderUpload from "./FolderUpload.jsx";
import Input from "./Input.jsx";
import Popup from "./Popup.jsx";
import Progress from "./Progress.jsx";
import UpdateFile from "./UpdateFile.jsx";
import UploadButton from "./UploadButton.jsx";

import generateSnowflakeId from '../api/snowflakeIdGenerator.js';

export default function NewButton({ fetchFolder }) {



   const [code, setCode] = useState(0);
   const [show, setShow] = useState(false);
   const [msg, setMsg] = useState("");



   const [resourceName, setResourceName] = useState("");
   const { currentFolderId } = useContext(FoldContext);

   const [showUpdateFile, setShowUpdateFile] = useState(false);

   const [fileObject, setFileObject] = useState({});
   const [getFolderId, setFolderId] = useState({});

   const [showProgress, setShowProgress] = useState(false);
   const [progressValue, setProgressValue] = useState([0, 100, "FILE","Nothing",true]);

   async function getProgress(uploadId, intervalId, size, type = "FILE", fileName) {
      let res = await fetch("http://localhost:8080/WorkDrive/UploadProgressServlet?uploadId=" + uploadId, {
         method: "GET",
      });

      const data = await res.json();

      if (data.StatusCode != 200) return;

      if (data.message == "Successfully Uploaded") {
         clearInterval(intervalId);
         return;
      }

      if (type == "FILE") {
         setProgress(((data.value / size) * 100), 100, type, fileName);
      } else {
         setProgress(data.value, size, type, fileName);
      }

      setShow(false);

   }

   function setProgress(value, total, type, fileName) {
      setShowProgress(true);
      setProgressValue([value, total, type, fileName]);
   }



   async function uploadFile(files, change, folderId) {
      for (let file of files) {
         
         const uploadId = generateSnowflakeId().toString();

         let fName = file.name;
         let fileSize = file.size;

         let form = new FormData();
         form.append("file", file);
         form.append("filename", fName);
         form.append("folderId", folderId);
         form.append("replaceFile", change);
         form.append("uploadId", uploadId);
         form.append("size", fileSize);

         showResult(201, "⬇ File Uploading ...", true)

         const progress = setInterval(() => {
            getProgress(uploadId, progress, fileSize, "FILE", fName);
         }, 1000);

         let res = await fetch("http://localhost:8080/WorkDrive/secure/UploadFileServlet", {
            method: "POST",
            credentials: "include",
            body: form
         });

         const data = await res.json();
         clearInterval(progress);
            setShowProgress(false);

         if (data.StatusCode == 200) {
            showResult(data.StatusCode, data.message, true);
            setShowFolderinput(false);
         }
         if (data.StatusCode >= 400) {
            if (data.message == "File already exists") {
               setShow(false);
               setFileObject(file);
               setFolderId(folderId);
               setShowUpdateFile(true);
            }
            else {
               showResult(data.StatusCode, " File upload Failed", true)
            }
         }
         setTimeout(() => { }, 2000);
      }

   }

   async function UploadFile(file, change, folderId) {

      const uploadId = generateSnowflakeId().toString();

      let fName = file.name;
      let fileSize = file.size;

      let form = new FormData();
      form.append("file", file);
      form.append("filename", fName);
      form.append("folderId", folderId);
      form.append("replaceFile", change);
      form.append("uploadId", uploadId);
      form.append("size", fileSize);

      showResult(201, "⬇ File Uploading ...", true)

      const progress = setInterval(() => {
         getProgress(uploadId, progress, fileSize, "FILE", fName);
      }, 1000);

      let res = await fetch("http://localhost:8080/WorkDrive/secure/UploadFileServlet", {
         method: "POST",
         credentials: "include",
         body: form
      });

      let data = await res.json();
      clearInterval(progress);
         setShowProgress(false);

      if (data.StatusCode == 200) {
         showResult(data.StatusCode, data.message, true);
         setShowFolderinput(false);
      }

      if (data.StatusCode >= 400) {
         if (data.message == "File already exists") {
            setShow(false);
            setFileObject(file);
            setFolderId(folderId);
            setShowUpdateFile(true);
         }
         else {
            showResult(data.StatusCode, " File upload Failed", true)
         }
      }
   }

   async function uploadFolder(files, change, parentId) {

      const uploadId = generateSnowflakeId().toString();

      let size = files.length;

      const formData = new FormData();

      for (let file of files) {
         formData.append("files", file);
      }

      formData.append("parentId", parentId);
      formData.append("uploadId", uploadId);

      showResult(201, "⬇ Folder Uploading ...", true)

      let folderName = files[0].webkitRelativePath.split("/")[0];

      const progress = setInterval(() => {
         getProgress(uploadId, progress, size, "FOLDER", folderName);
      }, 1000);

      let res = await fetch("http://localhost:8080/WorkDrive/FolderUploadServlet", {
         method: "POST",
         credentials: "include",
         body: formData,
      });

      let data = await res.json();
      clearInterval(progress);
         setShowProgress(false);

      if (data.StatusCode == 200) {
         showResult(data.StatusCode, "Folder uploaded sucessfully", true);
         setShowFolderinput(false);
      }
      if (data.StatusCode >= 400) {
         showResult(data.StatusCode, "Folder upload Failed", true)
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
         showResult(data.StatusCode, "Folder created sucessfully", true);
         setShowFolderinput(false);
      }
      if (data.StatusCode >= 400) {
         showResult(data.StatusCode, "Folder creation Failed", true)
      }

   }

   function skipFile() {
      setShowUpdateFile(false);
   }

   function updateFile() {

      setShowUpdateFile(false);
      UploadFile(fileObject, true, getFolderId);

   }

   function showResult(Code, msg, chk) {
      fetchFolder(currentFolderId.id);
      setCode(Code);
      setMsg(msg);
      setShow(chk);
      setTimeout(() => { setShow(false) }, 1500)
   }

   function getValue(name) {
      setResourceName(name);
   }

   const [showFolderInput, setShowFolderinput] = useState(false);


   return (
      <>
         <div className="newButtonBox">
            <Button id="newButton"><FaPlus /> New</Button>

            <div className="dropdownMenu">
               <Button className="dropdown" onClick={() => setShowFolderinput(true)}><RiFolderAddLine size={25} />Folder</Button>
               <UploadButton onUpload={(file) => uploadFile(file, false, currentFolderId.id)} ></UploadButton>
               <FolderUpload onUpload={(files) => uploadFolder(files, false, currentFolderId.id)}></FolderUpload>
            </div>
         </div>

         <Popup result={code} msg={msg} show={show}></Popup>
         {showUpdateFile && <UpdateFile update={updateFile} skip={skipFile}></UpdateFile>}
         <Progress value={progressValue[0]} total={progressValue[1]} type={progressValue[2]} fileName={progressValue[3]} show={showProgress}></Progress>
         {showFolderInput && <Input placeholder="Enter the Folder Name" sendValue={getValue} submitBtn={"Create"} onClick={() => createFolder(resourceName, currentFolderId.id)} cancel={() => setShowFolderinput(false)}>Create New Folder</Input>}

      </>
   );
}
