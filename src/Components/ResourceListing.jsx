import { useState, useEffect, useContext } from "react";
import Icon from '@mdi/react';
import { mdiFileOutline, mdiFolderOutline } from '@mdi/js';
import '../Style/ResourceListing.css';
import FileHeader from "./FileHeader";
import { getResources } from "../api/workdriveapi";
import { FoldContext } from "../utils/FolderContext";
import Popup from "./Popup";

// export const mockResources = {
//     null: [
//         {
//             document_id: 1,
//             document_name: "Documents",
//             document_type: "FOLDER",
//             document_created_at: "2024-01-01",
//             document_last_modified: "2024-01-05"
//         },
//         {
//             document_id: 2,
//             document_name: "notes.txt",
//             document_type: "FILE",
//             document_created_at: "2024-01-02",
//             document_last_modified: "2024-01-06",
//             document_size: "12 KB"
//         }
//     ],
//     1: [
//         {
//             document_id: 3,
//             document_name: "Projects",
//             document_type: "FOLDER",
//             document_created_at: "2024-01-03",
//             document_last_modified: "2024-01-07"
//         },
//         {
//             document_id: 4,
//             document_name: "resume.pdf",
//             document_type: "FILE",
//             document_created_at: "2024-01-04",
//             document_last_modified: "2024-01-08",
//             document_size: "220 KB"
//         }
//     ],
//     3: [
//         {
//             document_id: 5,
//             document_name: "workdrive.docx",
//             document_type: "FILE",
//             document_created_at: "2024-01-05",
//             document_last_modified: "2024-01-09",
//             document_size: "1.2 MB"
//         }
//     ]
// };

export default function ResourceListing() {
    const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
    const [resources, setResources] = useState([]);
    const [currentMenuId, setCurrentMenuId] = useState(null);
    const {currentFolderId, setCurrentFolderId} = useContext(FoldContext);
    const[code , setCode] = useState(0);
    const[show , setShow] = useState(false);
    const[msg , setMsg] = useState("");


    async function deleteResource(resourceName , resourceType){
        if(resourceType == "FILE"){
            let folderId = currentFolderId.id;
            let response = await fetch("http://localhost:8080/WorkDrive/DeleteFileServlet" , {
                method : "POST",
                headers : {"Content-Type" : "application/json"},
                body : JSON.stringify({folderId , filename:resourceName})
            });
            let data = await response.json();

            if(data.StatusCode == 200){
                showResult(data.StatusCode , "✅ File deleted successfully" , true)
             }
             if(data.StatusCode >= 400){
                showResult(data.StatusCode , "❌ File deleted Failed" , true)
             }
            
        }else{
            const response = await fetch("http://localhost:8080/WorkDrive/FolderDeleteServlet", {
			method : "POST",
            credentials : "include",
			headers : {
				"Content-Type" : "application/json"
			},
			body : JSON.stringify({
				resourceId : resourceName,
			})     

		});

		const data = await response.json();

        if(data.StatusCode == 200){
            showResult(data.StatusCode , "✅ Folder deleted successfully" , true)
         }
         if(data.StatusCode >= 400){
            showResult(data.StatusCode , "❌ Folder deleted Failed" , true)
         }

        }
    }

    async function downloadFile( filename ,folderId , resourceType){

        let response = await fetch("http://localhost:8080/WorkDrive/DownloadFileServlet" , {
            method : "POST",
            headers : {"Content-Type" : "application/json"},    
            body : JSON.stringify({filename , folderId })
        });
        let data = await response.json();
        if(data.StatusCode == 200){
            showResult(data.StatusCode , "✅ File downloaded successfully" , true)
         }
         if(data.StatusCode >= 400){
            showResult(data.StatusCode , "❌ File downloaded Failed" , true)
         }
    }


    function showResult(Code , msg , chk){
        fetchFolder(currentFolderId.id);
        setCode(Code);
        setMsg(msg);
        setShow(chk);
        setTimeout(()=>{setShow(false)},2000)
    }

    useEffect(() => {
        fetchFolder(currentFolderId.id);
        console.log(currentFolderId.id);
    }, [currentFolderId.id]);
    
    async function fetchFolder(parentId) {
        // if (useStaticData) {
        //     const resources = mockResources[parentId] || [];
        //     setData(prev => ({...prev, [parentId] : resources}));
        //     setResources(resources);
        //     return;
        // }
        try {
            const resourceResponse = await getResources(parentId);
            console.log(resourceResponse);
            const rawResources = resourceResponse.resource;
            console.log(rawResources);
            const resources = rawResources.map(resource => {
                const isFolder = resource.type === "FOLDER";
                // if (resource.resourceId) {
                //     return { id: resource.resourceId, name: resource.resourceName, type: "FOLDER", created: resource.createdTime, modified: resource.modifiedTime };
                // } else {
                //     return { id: resource.id, name: resource.filename, type: "FILE", created: resource.createTime, modified: resource.modifiedTime };
                // }
                return {
                    id : resource.id,
                    name : isFolder ? resource.resourceName : resource.filename,
                    type : resource.type,
                    created : isFolder ? resource.createdTime : resource.createTime,
                    modified : resource.modifiedTime,
                    size : resource.size
                };
            });
            console.log(resources);
            setCurrentFolderId({ id : resourceResponse.folderId});
            setResources(resources);
        } catch (err) {
            console.error("Error fetching rsources ", err);
        }
    }

    function openFolder(resource) {
        if (resource.type !== "FOLDER") return;
        setCurrentFolderId({ id: resource.id });
        setBreadCrumbLinks(prev => [...prev, resource]);
    }

    function goToRootFolder() {
        setCurrentFolderId({ id: null });
        setBreadCrumbLinks([]);
    }

    function goToBreadCrumbLink(index) {
        const path = breadCrumbLinks.slice(0, index + 1);
        const folder = path[index];
        setCurrentFolderId({ id: folder.id });
        setBreadCrumbLinks(path);
    }

    const handleClick = (e, id) => {
        e.stopPropagation();
        setCurrentMenuId(prev => (prev === id ? null : id));
    }

    return (
        <div className="fileResource">

            <FileHeader fetchFolder={fetchFolder}>
                <div className="tree-header">
                    <div className="breadCrumbs">
                        <span onClick={goToRootFolder}>My Folder</span>
                        {breadCrumbLinks.map((folder, index) => (
                            <span key={folder.id}>
                                {">"} <span className="link" onClick={() => goToBreadCrumbLink(index)}>{folder.name}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </FileHeader>

            <div className="heading grid-row heading-row">
                <span className="name">Name</span>
                <span className="createdAt">Created At</span>
                <span className="lastModified">Last Modified</span>
                <span className="size">Size</span>
                <span></span>
            </div>

            <div className="resources">
                {resources.length === 0 && (
                    <div className="empty">
                        No Items Available
                    </div>
                )}
                {console.log(resources)}
                {resources.map(resource => (
                    <div className="file grid-row" key={resource.id} onClick={() => openFolder(resource)}>
                        <div className="name">
                            {resource.type === "FOLDER" ? <Icon path={mdiFolderOutline} size={1} /> : <Icon path={mdiFileOutline} size={1} />}
                            <span className="fileName">{resource.name}</span>
                        </div>
                        <span className="fileCreatedAt">{resource.created}</span>
                        <span className="fileLastModified">{resource.modified}</span>
                        <span className="fileSize">-</span>
                        <div className="optionsMenu">
                            <span className="icon" onClick={(e) => handleClick(e, resource.id)}>⋮</span>
                            {currentMenuId === resource.id && (<ul className="operationsMenu" onClick={(e) => e.stopPropagation()}>
                                <li onClick={() => {}}>Move</li>
                                <li onClick={() => {}}>Copy</li>
                                <li onClick={() => {}}>Paste</li>
                                <li onClick={() => {}}>Rename</li>
                                <li onClick={() => {deleteResource(resource.type == "FILE" ? resource.name : resource.id , resource.type)}}>Delete</li>
                                {resource.type == "FILE" && (<li onClick={() => {downloadFile(resource.name , currentFolderId.id , resource.type)}}>Download</li>)}
                            </ul>)}
                        </div>
                    </div>
                ))}
            </div>
            <Popup result={code} msg={msg} show={show}></Popup>
        </div>
    );
}