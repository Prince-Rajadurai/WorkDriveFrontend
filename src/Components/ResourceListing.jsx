import { mdiFileOutline, mdiFileTreeOutline, mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useContext, useEffect, useRef, useState } from "react";
import '../Style/ResourceListing.css';
import { getResources } from "../api/workdriveapi";
import { FoldContext } from "../utils/FolderContext";
import DetailsPage from './Details';
import FileHeader from "./FileHeader";
import Input from "./Input";
import Popup from "./Popup";
import Tree from "./Tree";
import UpdateFile from './UpdateFile';
import Button from './Button';
import { FaRegTrashAlt } from "react-icons/fa";
import { MdDriveFileMoveOutline } from "react-icons/md";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { GoVersions } from "react-icons/go";
import { LuTableProperties } from "react-icons/lu";
import { RiFileCopyLine } from "react-icons/ri";
import { FaRegPaste } from "react-icons/fa6";
import { MdOutlineFileDownload } from "react-icons/md";
import Version from './Version';

export default function ResourceListing() {
    const { breadCrumbLinks, setBreadCrumbLinks } = useContext(FoldContext);
    const [resources, setResources] = useState([]);
    const [currentMenuId, setCurrentMenuId] = useState(null);
    const { currentFolderId, setCurrentFolderId } = useContext(FoldContext);
    const [code, setCode] = useState(0);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState("");
    const [copyFileName, setCopyFileName] = useState("");
    const [oldFolderId, setOldFolderId] = useState("");
    const [copyType, setCopyType] = useState("");
    const [actionType, setActionType] = useState("");

    const [renamingFolderId, setRenamingFolderId] = useState("");
    const [renameFolderInput, setRenameFolderInput] = useState(false);
    const [newName, setNewName] = useState("");
    const [oldFilename, setOldFileName] = useState("");
    const [type, setType] = useState("");

    const [tempIdStore, setTempIdStore] = useState([]);

    const [showDetails, setShowDetails] = useState(false);
    const [detailsresource, setDetailsResource] = useState({});

    const [showTree, setShowTree] = useState(false);

    const [cursor, setCursor] = useState(0);
    const [more, setMore] = useState(true);
    const scrollRef = useRef(null);

    const [position, setPosition] = useState(null);
    // const [versions , setVersions] = useState([]);
    // const [fileSize , setFileSize] = useState("");
    // const [storageSize , setStorageSize] = useState("");
    const [getData , setData] = useState({});
    const [showVersion , setShowVersion] = useState(false);


    function storeResourceId(id, name, action) {
        setCopyType("FOLDER");
        setTempIdStore([id, name, action]);
        showResult(200, "Folder Copied Successfully", true);
    }

    function pasteResource(parentId) {
        if (tempIdStore[0] == null) {
            showResult(400, "No Resource Copied", true);
        }
        else if (tempIdStore[2] == "MOVE") {
            if (moveFolder(parentId, tempIdStore[0], tempIdStore[1])) {
                showResult(200, "Resource Moved Successfully", true);
            } else {
                showResult(400, "Failed to Move Folder", true);
            }
        } else if (tempIdStore[2] == "COPY") {
            if (copyFolder(parentId, tempIdStore[0], tempIdStore[1])) {
                showResult(200, "Resource Pasted Successfully", true);
                // openFolder()
            } else {
                showResult(400, "Failed to Move Folder", true);
            }
        }
        setTempIdStore([]);
    }


    async function updateFileName(folderId, olderFileName, newFileName) {

        let response = await fetch("http://localhost:8080/WorkDrive/UpdateFileName", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folderId, olderFileName, newFileName })
        });
        let data = await response.json();

        if (data.StatusCode == 200) {
            setRenameFolderInput(false)
            showResult(data.StatusCode, "File renamed successfully", true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "File renamed Failed", true)
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
                showResult(data.StatusCode, "File trashed successfully", true)
            }
            if (data.StatusCode >= 400) {
                showResult(data.StatusCode, "File trashing Failed", true)
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
            { showDetails && <DetailsPage resource={resource} cancel={() => setShowDetails(false)} /> }
            const data = await response.json();

            if (data.StatusCode == 200) {
                showResult(data.StatusCode, "Folder trashed successfully", true)
            }
            if (data.StatusCode >= 400) {
                showResult(data.StatusCode, "Folder trashing Failed", true)
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
                showResult(response.status, "File download failed", true);
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
            showResult(200, "File downloaded successfully", true);

        } catch (err) {
            console.error("Download error:", err);
            showResult(500, "File download failed", true);
        }
    }



    function showResult(Code, msg, chk) {
        setCursor(0);
        setMore(true);
        setResources([]);
        fetchFolder(currentFolderId.id, false);
        setCode(Code);
        setMsg(msg);
        setShow(chk);
        setTimeout(() => { setShow(false) }, 2000)
    }

    useEffect(() => {
        setCursor(0);
        setResources([]);
        fetchFolder(currentFolderId.id, false);
    }, [currentFolderId.id]);

    async function fetchFolder(parentId, load = false) {
        if (!more && load) return;

        try {
            const currentCursor = load ? cursor : 0;
            const resourceResponse = await getResources(parentId, currentCursor, 21);
            const rawResources = Array.isArray(resourceResponse.resources) ? resourceResponse.resources : [];
            const resourcesArr = rawResources.map(resource => ({
                id: resource.id,
                name: resource.name,
                type: resource.type,
                created: resource.createdTime,
                modified: resource.modifiedTime,
                size: resource.size,
                files : resource.files,
                folders : resource.folders
            }));
            setCurrentFolderId({ id: resourceResponse.folderId });
            setResources(prev => load ? [...prev, ...resourcesArr] : resourcesArr);
            setCursor(resourceResponse.nextCursor || 0);
            setMore((resourceResponse.nextCursor || 0) !== 0);
            console.log(resources);
        } catch (err) {
            console.log("Error fetching resources ", err);
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
            showResult(data.StatusCode, "Folder renamed successfully", true);
            setRenameFolderInput(false);
            fetchFolder(currentFolderId.id);
        } else {
            showResult(data.StatusCode, "Folder rename failed", true);
        }
    }

    function storedFileDetails(filename, oldFolder, fileId) {

        setActionType("COPY");
        showResult(200, "File copied successfully", true)
        setCopyFileName(filename);
        setOldFolderId(oldFolder);
        setCopyType("FILE");

    }

    function movestoredFileDetails(filename, oldFolder) {

        setActionType("MOVE");
        showResult(200, "File ready to move", true)
        setCopyFileName(filename);
        setOldFolderId(oldFolder);
        setCopyType("FILE");

    }

    async function moveFile(newFolderId) {
        const response = await fetch("http://localhost:8080/WorkDrive/MoveFileServlet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ filename: copyFileName, oldFolderId, newFolderId })
        });


        const data = await response.json();

        if (data.StatusCode == 200) {
            showResult(data.StatusCode, "File moved successfully", true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "File moved Failed", true)
        }
    }

    async function copyFile(newFolderId) {

        console.log(newFolderId);

        const response = await fetch("http://localhost:8080/WorkDrive/CopyFileServlet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ filename: copyFileName, oldFolderId, newFolderId })
        });


        const data = await response.json();

        if (data.StatusCode == 200) {
            showResult(data.StatusCode, "File paste successfully", true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "File paste Failed", true)
        }

    }

    async function showFileVersion(fileId){

        const response = await fetch("http://localhost:8080/WorkDrive/ShowFileVersions?fileId="+fileId ,{
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();

        setShowVersion(true);
        setData(data);

    }

    function onClose(){
        setShowVersion(false);
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

    function folderDetails(res) {
        setDetailsResource(res);
        setShowDetails(true);
    }

    function handleLeftClick(e) {

        if (e.target == e.currentTarget) {
            setCurrentMenuId(null);
            setPosition((prev) => {
                if(prev) return null;
                return {
                    x: e.pageX,
                    y: e.pageY,
                }
            });
        } else {
            setPosition(null);
        }

    }
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
                if (scrollHeight - scrollTop <= clientHeight) {
                    if (more) {
                        fetchFolder(currentFolderId.id, true);
                    }
                }
            }
        };
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", handleScroll);
            }
        };
    }, [more, currentFolderId.id, cursor]);

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
                        <span onClick={goToRootFolder} className='link'>My Folders</span>
                        {breadCrumbLinks.map((folder, index) => (
                            <span key={folder.id} style={{color:'black'}}>
                                {" > "} <span className="link" onClick={() => goToBreadCrumbLink(index)}>{folder.name}</span>
                            </span>
                        ))}
                    </div>
                </div>
            </FileHeader>

            <div className="heading grid-row heading-row" style={{ width: showDetails ? "67vw" : "84vw" }}>
                <span className="name">Name</span>
                <span className="createdAt">Created At</span>
                <span className="lastModified">Last Modified</span>
                <span className="size">Size</span>
                <span></span>
            </div>

            <div className="resources" ref={scrollRef} style={{ width: showDetails ? "67vw" : "84vw", overflowY: 'auto'}}  onClick={handleLeftClick}>
                {resources.length === 0 && (
                    <div className="empty">
                        No Items Available
                    </div>
                )}
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

                                <li onClick={() => { setRenamingFolderId(resource.id); setOldFileName(resource.name); setType(resource.type); setRenameFolderInput(true), setCurrentMenuId(null) }}><MdOutlineDriveFileRenameOutline />Rename</li>
                                {resource.type == "FILE" ?"" :<li onClick={(e) => { folderDetails(resource); handleClick(e, resource.id); }}><LuTableProperties />Properties</li>}
                                {resource.type == "FILE" && <li onClick={(e) =>{showFileVersion(resource.id) ,setCurrentMenuId(null)}}><GoVersions />Properties</li>}
                                <li onClick={() => { resource.type == "FOLDER" ? storeResourceId(resource.id, resource.name, "MOVE") : movestoredFileDetails(resource.name , currentFolderId.id ), setCurrentMenuId(null) }}><MdDriveFileMoveOutline size={17}/>Move</li>
                                <li onClick={() => { resource.type == "FOLDER" ? storeResourceId(resource.id, resource.name, "COPY") : storedFileDetails(resource.name , currentFolderId.id , resource.id), setCurrentMenuId(null) }}><RiFileCopyLine />Copy</li>
                                {resource.type == "FILE" ?"" :<li onClick={() => { copyType == "FOLDER" ? pasteResource(resource.id) : actionType == "COPY" ? copyFile(resource.id) : moveFile(resource.id), setCurrentMenuId(null) }}><FaRegPaste />Paste</li>}
                                <li onClick={() => { deleteResource(resource.type == "FILE" ? resource.name : resource.id, resource.type), setCurrentMenuId(null) }} style={{color:"#de1010db"}}><FaRegTrashAlt style={{color:"#de1010db"}}/>Trash</li>
                                {resource.type == "FILE" && (<li onClick={() => { downloadFile(resource.name, currentFolderId.id, resource.type), setCurrentMenuId(null) }}><MdOutlineFileDownload size={17}/>Download</li>)}

                            </ul>)}
                        </div>
                    </div>
                ))}
                {more && resources.length > 0 && (
                    <div className='loadingContainer'>Loading...</div>
                )}
                {position && <button className="paste-button" style={{
                    position: "fixed",
                    left: (position.x),
                    top: (position.y),
                }} onClick={() => { copyType == "FOLDER" ? pasteResource(currentFolderId.id) : actionType == "COPY" ? copyFile(currentFolderId.id) : moveFile(currentFolderId.id), setCurrentMenuId(null) }}>Paste</button>}

            </div>
            {showDetails && <DetailsPage resource={detailsresource} cancel={() => setShowDetails(false)} />}
            <Popup result={code} msg={msg} show={show}></Popup>
            {showVersion && <Version storage = {getData.storage} size = {getData.size} versions = {getData.versions} onclose={onClose}></Version>}
            {renameFolderInput && <Input placeholder={type == "FOLDER" ? "Enter the New Folder Name" : "Enter the New File Name"} sendValue={setNewName} onClick={() => { type == "FOLDER" ? renameFolder(newName, renamingFolderId) : updateFileName(currentFolderId.id, oldFilename, newName) }} cancel={() => setRenameFolderInput(false)} submitBtn={"Rename"}>{type == "FOLDER" ? "New Folder Name" : "New File Name"}</Input>}
        </div>
    );
}