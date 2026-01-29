import { useState, useRef, useEffect } from "react";
import Icon from '@mdi/react';
import { mdiFileTree, mdiFileOutline, mdiFolderOutline } from '@mdi/js';
import './ResourceListing.css';
import Tree from "./Tree";
import { getFolder, getFiles } from "../api/workdriveapi";


export default function ResourceListing() {
    const [data, setData] = useState({});
    const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
    const [resources, setResources] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState({});
    const treeRef = useRef(null);
    
    const [showTree, setShowTree] = useState(false);

    useEffect(() => {
        fetchFolder(null);
    }, []);

    async function fetchFolder(parentId) {
        const foldersResponse = await getFolder(parentId);
        const filesResponse = await  getFiles(parentId);
        const folders = Array.isArray(foldersResponse) ? foldersResponse : [];
        const files = Array.isArray(filesResponse) ? filesResponse : [];
        const resources = [...folders, ...files];
        setData(prev => ({...prev, [parentId] : resources }));
        setResources(resources);
    }

    function openFolder(resource) { 
        if (resource.document_type !== "FOLDER") return;
        setBreadCrumbLinks(prev => [...prev, resource]);
        if (data[resource.document_id]) {
            setResources(data[resource.document_id]);
        } else {
            fetchFolder(resource.document_id);
        }
    }

    function openFromTree(folder) {
        setBreadCrumbLinks(prev => [...prev, folder]);
        if (data[folder.document_id]) {
            setResources(data[folder.document_id]);      
        } else {
            fetchFolder(folder.document_id);
        }
    }

    function goToRootFolder() {
        setBreadCrumbLinks([]);
        setResources(data[null] || []);
    }

    function goToBreadCrumbLink(index) {
        const path = breadCrumbLinks.slice(0, index + 1);
        setBreadCrumbLinks(path);
        setResources(data[path[index].document_id] || []);
    }

    function toggleFolders(folderId) {
        setExpandedFolders(prev => ({...prev, [folderId] : !prev[folderId]}));
    }

    return (
        <div className="fileResource">

            <div className="heading grid-row heading-row">
                <span className="name">Name</span>
                <span className="createdAt">Created At</span>
                <span className="lastModified">Last Modified</span>
                <span className="size">Size</span>
            </div>

            <div className="resources">
                {resources.length === 0 && (
                    <div className="empty">
                        No Items Available
                    </div>
                )}
                {resources.map(resource => (
                    <div className="file grid-row" key={resource.document_id} onClick={() => openFolder(resource)}>
                        <div className="name">
                            {resource.document_type === "FOLDER" ? <Icon path={mdiFolderOutline} size={1} /> : <Icon path={mdiFileOutline} size={1} />}
                            <span className="fileName">{resource.document_name}</span>
                        </div>
                        <span className="fileCreatedAt">{resource.document_created_at}</span>
                        <span className="fileLastModified">{resource.document_last_modified}</span>
                        <span className="fileSize">{resource.document_size || "-"}</span>
                        <span className="dropdownMenu" onContextMenu={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setOperationsMenu({
                                x: e.pageX,
                                y: e.pageY,
                                resource
                            })
                        }}>⋮</span>
                    </div>
                ))}
            </div>

            {showTree && (
                <div className="dropDownBox" onClick={() => setShowTree(false)}>
                    <div className="box" onClick={e => e.stopPropagation()} ref={treeRef}>
                        <Tree parentId={null} data={data} expandedFolders={expandedFolders} toggleFolder={toggleFolders} onFolderSelect={openFromTree}></Tree>
                    </div>
                </div>
            )}
        </div>
    );
}