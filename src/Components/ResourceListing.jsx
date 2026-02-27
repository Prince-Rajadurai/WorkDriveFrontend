import { mdiFileTreeOutline } from '@mdi/js';
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
import FileIcons from './FileIcons';
import Input from "./Input";
import Popup from "./Popup";
import Tree from "./Tree";
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

    const [folderCursor, setFolderCursor] = useState(0);
    const [fileCursor, setFileCursor] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);
    const treeRef = useRef(null);

    const [position, setPosition] = useState(null);
    const [getData, setData] = useState({});
    const [showVersion, setShowVersion] = useState(false);
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");


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
            if (copyFolder(parentId, tempIdStore[0], tempIdStore[1])) {
                showResult(200, "Resource Pasted Successfully", true);
            } else {
                showResult(400, "Failed to Move Folder", true);
            }
        }
        setTempIdStore([]);
        setCopyFileName("");
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
            showResult(data.StatusCode, "File renamed successfully", true, true);
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "File renamed Failed", true);
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


    async function deleteResource(resourceId, resourceType) {
        if (resourceType == "FILE") {

            let folderId = currentFolderId.id;
            let response = await fetch("http://localhost:8080/WorkDrive/TrashFile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ folderId, resourceId, type: "FILE" })
            });
            let data = await response.json();

            if (data.StatusCode == 200) {
                showResult(data.StatusCode, "File move to trash", true, true)
            }
            if (data.StatusCode >= 400) {
                showResult(data.StatusCode, "File trashing Failed", true)
            }

        } else {
            const response = await fetch("http://localhost:8080/WorkDrive/TrashFile", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resourceId: resourceId, type: "FOLDER"
                })

            });
            { showDetails && <DetailsPage resource={resource} cancel={() => setShowDetails(false)} /> }
            const data = await response.json();

            if (data.StatusCode == 200) {
                showResult(data.StatusCode, "Folder move to trash", true, true)
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
    }, [sortBy, sortOrder, currentFolderId.id]);

    async function fetchFolder(parentId, load = false) {
        if (isLoading) return;
        if (load && !hasMore) return;

        setIsLoading(true);

        try {
            const cursor1 = load ? folderCursor : 0;
            const cursor2 = load ? fileCursor : 0;
            const resourceResponse = await getResources(parentId, cursor1, cursor2, 30, sortBy, sortOrder);
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
            setCurrentFolderId({ id: resourceResponse.folderId })
            setResources(prev => {
                if (!load) return resourcesArr;
                const map = new Map(prev.map(r => [r.id, r]));
                resourcesArr.forEach(r => map.set(r.id, r));
                return Array.from(map.values());
            });
            const cursors = resourceResponse.cursors || {};
            setFolderCursor(cursors.folderCursor ?? -1);
            setFileCursor(cursors.fileCursor ?? -1);
            setHasMore(Boolean(cursors.hasMore));
            console.log(resourcesArr);
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
        console.log(currentFolderId);
        setActionType("MOVE");
        console.log("===> " + oldFolder);
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

        const response = await fetch("http://localhost:8080/WorkDrive/CopyFileServlet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ filename: copyFileName, oldFolderId, newFolderId })
        });


        const data = await response.json();

        setCopyFileName("");
        setTempIdStore([]);


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
        setPosition(null);
        e.stopPropagation();
        setCurrentMenuId(prev => (prev === id ? null : id));
    }

    function folderDetails(res) {
        setDetailsResource(res);
        setShowDetails(true);
    }

    function handleRightClick(e) {
        if (e.target === e.currentTarget && (tempIdStore[0] != null || copyFileName != "")) {
            e.preventDefault();

            setCurrentMenuId(null);

            setPosition(prev => {
                return {
                    x: e.pageX,
                    y: e.pageY
                }
            }
            );
        } else {
            setPosition(null);

        }
    }

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;
        const handleScroll = () => {
            console.log("hi 1")
            const { scrollTop, scrollHeight, clientHeight } = container;
            if (scrollHeight - scrollTop <= clientHeight + 5) {
                console.log("hi 2")
                if (!isLoading && hasMore) {
                    fetchFolder(currentFolderId.id, true);
                }
            }
        };
        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [currentFolderId.id, hasMore, isLoading]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (treeRef.current && !treeRef.current.contains(event.target)) {
                setShowTree(false);
            }
        }

        function handleEscape(e) {
            if (e.key === "Escape") setShowTree(false);
        }

        if (showTree) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [showTree])

    function handleSort(column) {
        if (sortBy === column) {
            setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    }

    function renderSortIcon(column) {
        if (sortBy !== column) return null;
        return sortOrder === "asc" ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        );
    }

    return (
        <div className="fileResource">

            <FileHeader fetchFolder={fetchFolder} >
                <div className="tree-header">
                    <div className="tree" onClick={() => { setShowTree(true) }} >
                        <Icon path={mdiFileTreeOutline} size={1} />
                    </div>
                    {showTree && (
                        <>
                            <div className="dropDownBox"></div>
                            <div className="treeDropdown" ref={treeRef}>
                                <Tree />
                            </div>
                        </>
                    )}
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
                <span className="name" onClick={() => handleSort("name")}>Name {renderSortIcon("name")}</span>
                <span className="createdAt" onClick={() => handleSort("createdTime")}>Created At {renderSortIcon("createdTime")}</span>
                <span className="lastModified" onClick={() => handleSort("modifiedTime")}>Last Modified {renderSortIcon("modifiedTime")}</span>
                <span className="size">Size</span>
                <span></span>
            </div>

            <div className="resources" ref={scrollRef} style={{ width: showDetails ? "67vw" : "84vw", overflowY: 'auto' }} onContextMenu={handleRightClick} onClick={() => {setPosition(null);setCurrentMenuId(null)}}>
                {resources.length === 0 && (
                    <div className="empty">
                        No Items Available
                    </div>
                )}

                {resources.map(resource => (
                    <div className="file grid-row" key={resource.id} onClick={() => openFolder(resource)}>
                        <div className="name">
                            {resource.type === "FOLDER" ? <svg width={24} height={24} viewBox="0 0 24 24" fill="none"> <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg> : <FileIcons>{resource.name}</FileIcons>}
                            <span className="fileName">{resource.name}</span>
                        </div>
                        <span className="fileCreatedAt">{resource.created}</span>
                        <span className="fileLastModified">{resource.modified}</span>
                        <span className="fileSize">{resource.size || "-"}</span>
                        <div className="optionsMenu">
                            <span className="icon" onClick={(e) => handleClick(e, resource.id)}>⋮</span>
                            {currentMenuId === resource.id && (<ul className="operationsMenu" onClick={(e) => e.stopPropagation()}>
                                <li onClick={() => { setRenamingFolderId(resource.id); setOldFileName(resource.name); setType(resource.type); setRenameFolderInput(true), setCurrentMenuId(null) }}><MdOutlineDriveFileRenameOutline />Rename</li>
                                {resource.type == "FILE" ? <li onClick={(e) => { showFileVersion(resource.id), setCurrentMenuId(null) }}><GoVersions />Versions</li> : <li onClick={(e) => { folderDetails(resource); handleClick(e, resource.id); }}><LuTableProperties />Properties</li>}
                                <li onClick={() => { resource.type == "FOLDER" ? storeResourceId(resource.id, resource.name, "MOVE") : movestoredFileDetails(resource.name, currentFolderId.id), setCurrentMenuId(null) }}><MdDriveFileMoveOutline size={17} />Move</li>
                                <li onClick={() => { resource.type == "FOLDER" ? storeResourceId(resource.id, resource.name, "COPY") : storedFileDetails(resource.name, currentFolderId.id, resource.id), setCurrentMenuId(null) }}><RiFileCopyLine />Copy</li>
                                {resource.type == "FILE" ? "" : (copyFileName!=""||tempIdStore[0]!=null)?<li onClick={() => { copyType == "FOLDER" ? pasteResource(resource.id) : actionType == "COPY" ? copyFile(resource.id) : moveFile(resource.id), setCurrentMenuId(null) }}><FaRegPaste />Paste</li> : ""}
                                <li onClick={() => { resource.type == "FILE" ? deleteResource(resource.id, resource.type) : deleteResource(resource.id, resource.type), setCurrentMenuId(null) }} style={{ color: "#de1010db" }}><FaRegTrashAlt style={{ color: "#de1010db" }} />Trash</li>
                                {resource.type == "FILE" && (<li onClick={() => { downloadFile(resource.name, currentFolderId.id, resource.type), setCurrentMenuId(null) }}><MdOutlineFileDownload size={17} />Download</li>)}

                            </ul>)}
                        </div>
                    </div>
                ))}

                {isLoading && resources.length > 0 && (
                    <div className='loadingContainer'>Loading...</div>
                )}

                {position && <button className="paste-button" style={{
                    position: "fixed",
                    zIndex:"10",
                    left: (position.x),
                    top: (position.y),
                }} onClick={() => { copyType == "FOLDER" ? pasteResource(currentFolderId.id) : actionType == "COPY" ? copyFile(currentFolderId.id) : moveFile(currentFolderId.id), setCurrentMenuId(null) }}>Paste</button>}

            </div>
            {showDetails && <DetailsPage resource={detailsresource} cancel={() => setShowDetails(false)} />}
            <Popup result={code} msg={msg} show={show}></Popup>
            {showVersion && <Version storage={getData.storage} size={getData.size} versions={getData.versions} compressSize = {getData.compressSize} onclose={onClose}></Version>}
            {renameFolderInput && <Input placeholder={type == "FOLDER" ? "Enter the New Folder Name" : "Enter the New File Name"} sendValue={setNewName} onClick={() => { type == "FOLDER" ? renameFolder(newName, renamingFolderId) : updateFileName(currentFolderId.id, oldFilename, newName) }} cancel={() => setRenameFolderInput(false)} submitBtn={"Rename"}>{type == "FOLDER" ? "New Folder Name" : "New File Name"}</Input>}
        </div>
    );
}