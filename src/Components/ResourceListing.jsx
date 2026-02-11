import { mdiFileOutline, mdiFileTreeOutline, mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useContext, useEffect, useState } from "react";
import '../Style/ResourceListing.css';
import { getResources } from "../api/workdriveapi";
import { FoldContext } from "../utils/FolderContext";
import DetailsPage from './Details';
import FileHeader from "./FileHeader";
import Input from "./Input";
import Popup from "./Popup";
import Tree from "./Tree";
import UpdateFile from './UpdateFile';

export default function ResourceListing() {
    const { breadCrumbLinks, setBreadCrumbLinks } = useContext(FoldContext);
    const [resources, setResources] = useState([]);
    const [currentMenuId, setCurrentMenuId] = useState(null);
    const { currentFolderId, setCurrentFolderId } = useContext(FoldContext);
    const [code, setCode] = useState(0);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState("");
    const [copyFileName , setCopyFileName] = useState("");
    const [oldFolderId , setOldFolderId] = useState("");
    const [copyType , setCopyType] = useState("");
    const [actionType , setActionType] = useState("");

    const [renamingFolderId, setRenamingFolderId] = useState("");
    const [renameFolderInput, setRenameFolderInput] = useState(false);
    const [newName, setNewName] = useState("");
    const [oldFilename, setOldFileName] = useState("");
    const [type, setType] = useState("");

    const [tempIdStore, setTempIdStore] = useState([]);

    const [ showDetails,setShowDetails]=useState(false);
    const [ detailsresource,setDetailsResource]=useState({});


    function storeResourceId(id, name, action) {

        setCopyType("FOLDER");
        setTempIdStore([id, name, action]);
        showResult(200, "✅ Copied Successfully", true);
    }

    function pasteResource(parentId, resource) {
        if (tempIdStore[0] == null) {
            showResult(400, "❌ No Resource Copied", true);
        }
        else if (tempIdStore[2] == "MOVE") {
            if (moveFolder(parentId, tempIdStore[0], tempIdStore[1])) {
                showResult(200, "✅ Resource Moved Successfully", true);
            } else {
                showResult(400, "❌ Failed to Move", true);
            }
            openFolder(resource);
            fetchFolder(parentId);
        } else if (tempIdStore[2] == "COPY") {
           console.log(parentId,tempIdStore);
            if (copyFolder(parentId, tempIdStore[0], tempIdStore[1])) {
                showResult(200, "✅ Resource Moved Successfully", true);
            } else {
                showResult(400, "❌ Failed to Move", true);
            }
            openFolder(resource);
            fetchFolder(parentId);
        }
        setTempIdStore([]);
    }


    async function updateFileName(folderId , olderFileName, newFileName) {

        let response = await fetch("http://localhost:8080/WorkDrive/UpdateFileName", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folderId, olderFileName, newFileName })
        });
        let data = await response.json();

        if (data.StatusCode == 200) {
            setRenameFolderInput(false)
            showResult(data.StatusCode, "✅ File renamed successfully", true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "❌ File renamed Failed", true)
        }
    }
    async function copyFolder(parentId, resourceId, resourceName) {

        const response = await fetch("http://localhost:8080/WorkDrive/CopyResourceServlet", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                resourceName,
                parentId,
                resourceId
            })
        });

        const data = await response.json();

        console.log("Server response:", data);
    }

    async function moveFolder(parentId, resourceId, resourceName) {

        const response = await fetch("http://localhost:8080/WorkDrive/MoveResourceServlet", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                parentId,
                resourceId,
                resourceName
            })

        });

        const data = await response.json();
        if (data.StatusCode == 200) {
            return true;
        } else {
            return false;
        }
    }


    async function deleteResource(resourceName, resourceType) {
        if (resourceType == "FILE") {
            let folderId = currentFolderId.id;
            let response = await fetch("http://localhost:8080/WorkDrive/DeleteFileServlet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folderId, filename: resourceName })
            });
            let data = await response.json();

            if (data.StatusCode == 200) {
                showResult(data.StatusCode, "✅ File deleted successfully", true)
            }
            if (data.StatusCode >= 400) {
                showResult(data.StatusCode, "❌ File deleted Failed", true)
            }

        } else {
            const response = await fetch("http://localhost:8080/WorkDrive/FolderServlet", {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resourceId: resourceName,
                })

            });
            {showDetails && <DetailsPage resource={resource} cancel={()=>setShowDetails(false)}/>}
            const data = await response.json();

            if (data.StatusCode == 200) {
                showResult(data.StatusCode, "✅ Folder deleted successfully", true)
            }
            if (data.StatusCode >= 400) {
                showResult(data.StatusCode, "❌ Folder deleted Failed", true)
            }

        }
    }

    async function downloadFile(filename, folderId) {
        try {
            const response = await fetch("http://localhost:8080/WorkDrive/DownloadFileServlet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename, folderId })
            });
    
            if (!response.ok) {
                showResult(response.status, "❌ File download failed", true);
                return;
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename; 
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            showResult(200, "✅ File downloaded successfully", true);
    
        } catch (err) {
            console.error("Download error:", err);
            showResult(500, "❌ File download failed", true);
        }
    }
    


    function showResult(Code, msg, chk) {
        fetchFolder(currentFolderId.id);
        setCode(Code);
        setMsg(msg);
        setShow(chk);
        setTimeout(() => { setShow(false) }, 2000)
    }
    const [showTree, setShowTree] = useState(false);

    useEffect(() => {
        fetchFolder(currentFolderId.id);
    }, [currentFolderId.id]);

    async function fetchFolder(parentId) {
        try {
            const resourceResponse = await getResources(parentId);
            const rawResources = resourceResponse.resource;
            const resources = rawResources.map(resource => {
                const isFolder = resource.type === "FOLDER";
                return {
                    id: resource.id,
                    name: isFolder ? resource.resourceName : resource.filename,
                    type: resource.type,
                    created: isFolder ? resource.createdTime : resource.createTime,
                    modified: resource.modifiedTime,
                    size: resource.size,
                    files: resource.files,
                    folders: resource.folders
                };
            });
            setCurrentFolderId({ id: resourceResponse.folderId });
            setResources(resources);
        } catch (err) {
            console.log("Error fetching rsources ", err);
        }
    }

    async function renameFolder(newName, resourceId) {
        const response = await fetch("http://localhost:8080/WorkDrive/FolderServlet", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ newName, resourceId })
        });
        const data = await response.json();
        if (data.StatusCode === 200) {
            showResult(data.StatusCode, "✅ Folder renamed successfully", true);
            setRenameFolderInput(false);
            fetchFolder(currentFolderId.id);
        } else {
            showResult(data.StatusCode, "❌ Folder rename failed", true);
        }
    }

    function storedFileDetails(filename , oldFolder , fileId){

        setActionType("COPY");
        showResult(200, "✅ File copied successfully", true)
        setCopyFileName(filename);
        setOldFolderId(oldFolder);
        setCopyType("FILE");

    }
    
    function movestoredFileDetails(filename , oldFolder ){

        setActionType("MOVE");
        showResult(200, "✅ File details copied successfully", true)
        setCopyFileName(filename);
        setOldFolderId(oldFolder);
        setCopyType("FILE");

    }

    async function moveFile(newFolderId){
        const response = await fetch("http://localhost:8080/WorkDrive/MoveFileServlet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename:copyFileName, oldFolderId , newFolderId })
        });

        
        const data = await response.json();

        if (data.StatusCode == 200) {
            showResult(data.StatusCode, "✅ File moved successfully", true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "❌ File moved Failed", true)
        }
    }

    async function copyFile(newFolderId){

        const response = await fetch("http://localhost:8080/WorkDrive/CopyFileServlet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename:copyFileName, oldFolderId , newFolderId })
        });

        
        const data = await response.json();

        if (data.StatusCode == 200) {
            showResult(data.StatusCode, "✅ File paste successfully", true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "❌ File paste Failed", true)
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

    function folderDetails(res){
        setDetailsResource(res);
      setShowDetails(true);
    }

    return (
        <div className="fileResource">

            <FileHeader fetchFolder={fetchFolder} >
                <div className="tree-header">
                    <div className="tree" onClick={() => { setShowTree(true) }} >
                        <Icon path={mdiFileTreeOutline} size={1} />
                    </div>
                    {showTree && (<>
                        <div className="dropDownBox" onClick={() => setShowTree(false)}></div>
                        <div className="treeDropdown">
                            <Tree></Tree>
                        </div>
                    </>)}
                    <div className="breadCrumbs">
                        <span onClick={goToRootFolder}>My Folder</span>
                        {breadCrumbLinks.map((folder, index) => (
                            <span key={folder.id}>
                                {" > "} <span className="link" onClick={() => goToBreadCrumbLink(index)}>{folder.name}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </FileHeader>

            <div className="heading grid-row heading-row" style={{width:showDetails?"67vw":"84vw"}}>
                <span className="name">Name</span>
                <span className="createdAt">Created At</span>
                <span className="lastModified">Last Modified</span>
                <span className="size">Size</span>
                <span></span>
            </div>

            <div className="resources" style={{width:showDetails?"67vw":"84vw"}}>
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
                        <span className="fileSize">{resource.size || "-"}</span>
                        <div className="optionsMenu">
                            <span className="icon" onClick={(e) => handleClick(e, resource.id)}>⋮</span>
                            {currentMenuId === resource.id && (<ul className="operationsMenu" onClick={(e) => e.stopPropagation()}>
                                <li onClick={() => { setRenamingFolderId(resource.id); setOldFileName(resource.name); setType(resource.type); setRenameFolderInput(true), setCurrentMenuId(null) }}>Rename</li>
                                {resource.type == "FILE" ?"" :<li onClick={(e) => { folderDetails(resource); handleClick(e, resource.id); }}>Details</li>}
                                <li onClick={() => { copyType == "FOLDER" ? storeResourceId(resource.id, resource.name, "MOVE") : movestoredFileDetails(resource.name , currentFolderId.id ), setCurrentMenuId(null) }}>Move</li>
                                <li onClick={() => { resource.type == "FOLDER" ? storeResourceId(resource.id, resource.name, "COPY") : storedFileDetails(resource.name , currentFolderId.id , resource.id), setCurrentMenuId(null) }}>Copy</li>
                                {resource.type == "FILE" ?"" :<li onClick={() => { copyType == "FOLDER" ? pasteResource(resource.id, resource) : actionType == "COPY" ? copyFile(resource.id) : moveFile(resource.id), setCurrentMenuId(null) }}>Paste</li>}
                                <li onClick={() => { deleteResource(resource.type == "FILE" ? resource.name : resource.id, resource.type), setCurrentMenuId(null) }}>Delete</li>
                                {resource.type == "FILE" && (<li onClick={() => { downloadFile(resource.name, currentFolderId.id, resource.type), setCurrentMenuId(null) }}>Download</li>)}
                            </ul>)}
                        </div>
                    </div>
                ))}
            </div>
            {showDetails && <DetailsPage resource={detailsresource} cancel={()=>setShowDetails(false)}/>};
            <Popup result={code} msg={msg} show={show}></Popup>
            {renameFolderInput && <Input placeholder={type == "FOLDER" ? "Enter the New Folder Name" : "Enter the New File Name"} sendValue={setNewName} onClick={() => { type == "FOLDER" ? renameFolder(newName, renamingFolderId) : updateFileName(currentFolderId.id, oldFilename, newName) }} cancel={() => setRenameFolderInput(false)} submitBtn={"Rename"}>{type == "FOLDER" ? "New Folder Name" : "New File Name"}</Input>}
        </div>
    );
}