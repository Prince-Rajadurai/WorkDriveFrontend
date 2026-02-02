import { useState, useEffect, useContext } from "react";
import Icon from '@mdi/react';
import { mdiFileOutline, mdiFolderOutline } from '@mdi/js';
import '../Style/ResourceListing.css';
import FileHeader from "./FileHeader";
import { getResources } from "../api/workdriveapi";
import { FoldContext } from "../utils/FolderContext";

export default function ResourceListing() {
    const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
    const [resources, setResources] = useState([]);
    const [currentMenuId, setCurrentMenuId] = useState(null);
    const {currentFolderId, setCurrentFolderId} = useContext(FoldContext);

    useEffect(() => {
        fetchFolder(currentFolderId.id);
        console.log(currentFolderId.id);
    }, [currentFolderId.id]);
    
    async function fetchFolder(parentId) {
        try {
            const resourceResponse = await getResources(parentId);
            console.log(resourceResponse);
            const rawResources = resourceResponse.resource;
            console.log(rawResources);
            const resources = rawResources.map(resource => {
                const isFolder = resource.type === "FOLDER";
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
                                <li onClick={() => {}}>Delete</li>
                                {resource.type === "FILE" && (<li onClick={() => {}}>Download</li>)}
                            </ul>)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}