import { mdiFileTreeOutline, mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useContext, useEffect, useRef, useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaRegPaste } from "react-icons/fa6";
import { GoVersions } from "react-icons/go";
import { LuTableProperties } from "react-icons/lu";
import { MdDriveFileMoveOutline, MdOutlineDriveFileRenameOutline, MdOutlineFileDownload } from "react-icons/md";
import { RiFileCopyLine } from "react-icons/ri";
import '../Style/ResourceListing.css';
import { getResources } from "../api/workdriveapi";
import { FoldContext } from "../utils/FolderContext";
import DetailsPage from './Details';
import FileHeader from "./FileHeader";
import Input from "./Input";
import Popup from "./Popup";
import Tree from "./Tree";
import Version from './Version';
import FileIcons from './FileIcons';

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

    const [folderCursor, setFolderCursor] = useState(0);
    const [fileCursor, setFileCursor] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    // const [more, setMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    const [position, setPosition] = useState(null);
    // const [versions , setVersions] = useState([]);
    // const [fileSize , setFileSize] = useState("");
    // const [storageSize , setStorageSize] = useState("");
    const [getData, setData] = useState({});
    const [showVersion, setShowVersion] = useState(false);


    function storeResourceId(id, name, action) {
        setCopyType("FOLDER");
        setTempIdStore([id, name, action]);
        showResult(200, "Folder Copied Successfully", true);
    }

    async function pasteResource(parentId) {
        if (tempIdStore[0] == null) {
            showResult(400, "No Resource Copied", true);
        }
        else if (tempIdStore[2] == "MOVE") {
            const success = await moveFolder(parentId, tempIdStore[0], tempIdStore[1]);
            if (success) {
                showResult(200, "Resource Moved Successfully", true, true);
            } else {
                showResult(400, "Failed to Move Folder", true);
            }
        } else if (tempIdStore[2] == "COPY") {
            const success = await copyFolder(parentId, tempIdStore[0], tempIdStore[1]);
            if (success) {
                showResult(200, "Resource Pasted Successfully", true, true);
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
            showResult(data.StatusCode, "File renamed successfully", true, true)
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
        return data.StatusCode === 200;
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
                showResult(data.StatusCode, "File trashed successfully", true, true)
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
                showResult(data.StatusCode, "Folder trashed successfully", true, true)
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



    function showResult(Code, msg, chk, refresh = false) {
        if (refresh) {
            setFolderCursor(0);
            setFileCursor(0);
            setHasMore(true);
            setResources([]);
            fetchFolder(currentFolderId.id, false);
        }
        setCode(Code);
        setMsg(msg);
        setShow(chk);
        setTimeout(() => { setShow(false) }, 2000)
    }

    useEffect(() => {
        setFolderCursor(0);
        setFileCursor(0);
        setHasMore(true);
        setResources([]);
        fetchFolder(currentFolderId.id, false);
    }, [currentFolderId.id]);

    async function fetchFolder(parentId, load = false) {
        if (isLoading || (load && folderCursor === 0 && fileCursor === 0)) return;

        setIsLoading(true);

        try {
            const cursor1 = load ? folderCursor : 0;
            const cursor2 = load ? fileCursor : 0;
            const resourceResponse = await getResources(parentId, cursor1, cursor2, 18);
            const rawResources = Array.isArray(resourceResponse.resources) ? resourceResponse.resources : [];
            const resourcesArr = rawResources.map(resource => ({
                id: resource.id,
                name: resource.name,
                type: resource.type,
                created: resource.createdTime,
                modified: resource.modifiedTime,
                size: resource.size,
                files: resource.files,
                folders: resource.folders
            }));
            setCurrentFolderId({ id: resourceResponse.folderId });
            // setResources(prev => load ? [...prev, ...resourcesArr] : resourcesArr);
            setResources(prev => {
                if (!load) return resourcesArr;

                const map = new Map(prev.map(r => [r.id, r]));
                resourcesArr.forEach(r => map.set(r.id, r));
                return Array.from(map.values());
            });

            const cursors = resourceResponse.cursors || {};
            // setCursor(resourceResponse.nextCursor || 0);
            if (typeof cursors.folderCursor === "number") {
                setFolderCursor(cursors.folderCursor);
            }
            if (typeof cursors.fileCursor === "number") {
                setFileCursor(cursors.fileCursor);
            }
            setHasMore(!!cursors.hasMore);
            // setMore((resourceResponse.nextCursor || 0) !== 0);
            console.log(resources);
        } catch (err) {
            console.log("Error fetching resources ", err);
        } finally {
            setIsLoading(false);
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
            showResult(data.StatusCode, "Folder renamed successfully", true, true);
            setRenameFolderInput(false);
            // fetchFolder(currentFolderId.id);
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
            showResult(data.StatusCode, "File moved successfully", true, true)
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
            showResult(data.StatusCode, "File paste successfully", true, true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "File paste Failed", true)
        }

    }

    async function showFileVersion(fileId) {

        const response = await fetch("http://localhost:8080/WorkDrive/ShowFileVersions?fileId=" + fileId, {
            method: "GET",
            credentials: "include"
        });
        const data = await response.json();

        setShowVersion(true);
        setData(data);

    }

    function onClose() {
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
                if (prev) return null;
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
            if (!scrollRef.current || !hasMore) return;
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollHeight - scrollTop <= clientHeight + 1) {
                if (!isLoading && hasMore) {
                    fetchFolder(currentFolderId.id, true);
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
    }, [hasMore, currentFolderId.id, folderCursor, fileCursor]);

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
                            <span key={folder.id} style={{ color: "black" }}>
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

            <div className="resources" ref={scrollRef} style={{ width: showDetails ? "67vw" : "84vw", overflowY: 'auto' }} onClick={handleLeftClick}>
                {resources.length === 0 && (
                    <div className="empty">
                        No Items Available
                    </div>
                )}
                {resources.map(resource => (
                    <div className="file grid-row" key={resource.id} onClick={() => openFolder(resource)}>
                        <div className="name">
                        {resource.type === "FOLDER" ? <Icon path={mdiFolderOutline} size={1} color={"black"} /> : <FileIcons>{resource.name}</FileIcons>}
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
                                {resource.type == "FILE" && <li onClick={(e) =>{showFileVersion(resource.id) ,setCurrentMenuId(null)}}><GoVersions />Version</li>}
                                <li onClick={() => { resource.type == "FOLDER" ? storeResourceId(resource.id, resource.name, "MOVE") : movestoredFileDetails(resource.name , currentFolderId.id ), setCurrentMenuId(null) }}><MdDriveFileMoveOutline size={17}/>Move</li>
                                <li onClick={() => { resource.type == "FOLDER" ? storeResourceId(resource.id, resource.name, "COPY") : storedFileDetails(resource.name , currentFolderId.id , resource.id), setCurrentMenuId(null) }}><RiFileCopyLine />Copy</li>
                                {resource.type == "FILE" ?"" :<li onClick={() => { copyType == "FOLDER" ? pasteResource(resource.id) : actionType == "COPY" ? copyFile(resource.id) : moveFile(resource.id), setCurrentMenuId(null) }}><FaRegPaste />Paste</li>}
                                <li onClick={() => { deleteResource(resource.type == "FILE" ? resource.name : resource.id, resource.type), setCurrentMenuId(null) }} style={{color : '#D32F2F'}}><FaRegTrashAlt />Trash</li>

                                {resource.type == "FILE" && (<li onClick={() => { downloadFile(resource.name, currentFolderId.id, resource.type), setCurrentMenuId(null) }}><MdOutlineFileDownload size={17}/>Download</li>)}

                            </ul>)}
                        </div>
                    </div>
                ))}
                {isLoading && resources.length > 0 && (
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
            {showVersion && <Version storage={getData.storage} size={getData.size} versions={getData.versions} onclose={onClose}></Version>}
            {renameFolderInput && <Input placeholder={type == "FOLDER" ? "Enter the New Folder Name" : "Enter the New File Name"} sendValue={setNewName} onClick={() => { type == "FOLDER" ? renameFolder(newName, renamingFolderId) : updateFileName(currentFolderId.id, oldFilename, newName) }} cancel={() => setRenameFolderInput(false)} submitBtn={"Rename"}>{type == "FOLDER" ? "New Folder Name" : "New File Name"}</Input>}
        </div>
    );
}