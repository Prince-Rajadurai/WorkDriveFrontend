import { useState, useEffect, useContext } from "react";
import Icon from '@mdi/react';
import { mdiFileOutline, mdiFolderOutline, mdiFileTreeOutline } from '@mdi/js';
import '../Style/ResourceListing.css';
import FileHeader from "./FileHeader";
import { getResources } from "../api/workdriveapi";
import { FoldContext } from "../utils/FolderContext";
import Popup from "./Popup";
import Input from "./Input";
import Tree from "./Tree";

export default function ResourceListing() {
    const { breadCrumbLinks, setBreadCrumbLinks } = useContext(FoldContext);
    const [resources, setResources] = useState([]);
    const [currentMenuId, setCurrentMenuId] = useState(null);
    const { currentFolderId, setCurrentFolderId } = useContext(FoldContext);
    const [code, setCode] = useState(0);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState("");

    const [renamingFolderId, setRenamingFolderId] = useState("");
    const [renameFolderInput, setRenameFolderInput] = useState(false);
    const [newName, setNewName] = useState("");

    const [tempIdStore, setTempIdStore] = useState([]);


    function storeResourceId(id, action) {
        setTempIdStore([id, action]);
        showResult(200, "✅ Copied Successfully", true);
    }

    function pasteResource(parentId) {
        if (tempIdStore[0] == null) {
            showResult(400, "❌ No Resource Copied", true);
        }
        else if (tempIdStore[2] == "MOVE") {
            moveFolder(parentId, tempIdStore[0], tempIdStore[1]);

        } else if (tempIdStore[2] == "COPY") {

        }
        setTempIdStore([]);
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

        console.log("Server response:", data);
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
            const response = await fetch("http://localhost:8080/WorkDrive/FolderDeleteServlet", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resourceId: resourceName,
                })

            });

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

        let response = await fetch("http://localhost:8080/WorkDrive/DownloadFileServlet", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename, folderId })
        });
        let data = await response.json();
        if (data.StatusCode == 200) {
            showResult(data.StatusCode, "✅ File downloaded successfully", true)
        }
        if (data.StatusCode >= 400) {
            showResult(data.StatusCode, "❌ File downloaded Failed", true)
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
                    size: resource.size
                };
            });
            setCurrentFolderId({ id: resourceResponse.folderId });
            setResources(resources);
        } catch (err) {
            console.error("Error fetching rsources ", err);
        }
    }

    async function renameFolder(newName, resourceId) {
        const response = await fetch("http://localhost:8080/WorkDrive/FolderUpdateServlet", {
            method: "POST",
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
                                <li onClick={() => { storeResourceId(resource.id, resource.name, "MOVE") }}>Move</li>
                                <li onClick={() => { storeResourceId(resource.id, resource.name, "COPY") }}>Copy</li>
                                <li onClick={() => { pasteResource(resource.id) }}>Paste</li>
                                <li onClick={() => { setRenamingFolderId(resource.id); setRenameFolderInput(true) }}>Rename</li>
                                <li onClick={() => { deleteResource(resource.type == "FILE" ? resource.name : resource.id, resource.type) }}>Delete</li>
                                {resource.type == "FILE" && (<li onClick={() => { downloadFile(resource.name, currentFolderId.id, resource.type) }}>Download</li>)}
                            </ul>)}
                        </div>
                    </div>
                ))}
            </div>
            <Popup result={code} msg={msg} show={show}></Popup>
            {renameFolderInput && <Input placeholder="Enter the New Folder Name" sendValue={setNewName} onClick={() => { renameFolder(newName, renamingFolderId) }} cancel={() => setRenameFolderInput(false)}>Folder</Input>}
        </div>
    );
}