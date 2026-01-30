import { createContext, useContext, useState, useRef, useEffect } from "react";
import Icon from '@mdi/react';
import { mdiFileTree, mdiFileOutline, mdiFolderOutline } from '@mdi/js';
import '../Style/ResourceListing.css';
import Tree from "./Tree";
import FileHeader from "./FileHeader";
import { getResources } from "../api/workdriveapi";
import { useFolder } from "../utils/FolderContext";

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
    const { currentFolderId, setCurrentFolderId } = useFolder();
    const [data, setData] = useState({});
    const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
    const [resources, setResources] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState({});
    // const useStaticData = true;

    useEffect(() => {
        fetchFolder(null);
    }, []);

    useEffect(() => {
        if (currentFolderId.id !== undefined) {
            fetchFolder(currentFolderId.id);
        }
    }, [currentFolderId.id]);

    async function fetchFolder(parentId) {
        if (data[parentId]) {
            setResources(data[parentId]);
            return;
        }
        // if (useStaticData) {
        //     const resources = mockResources[parentId] || [];
        //     setData(prev => ({...prev, [parentId] : resources}));
        //     setResources(resources);
        //     return;
        // }
        try {
            const resourceResponse = await getResources(parentId);
            const resources = Array.isArray(resourceResponse.resources) ? resourceResponse.resources.map(resource => ({ ...resource, parentId })) : [];
            {console.log(resources)}
            setData(prev => ({ ...prev, [parentId]: resources }));
            setResources(resources);
        } catch (err) {
            console.error("Error fetching rsources ", err);
        }
    }

    function openFolder(resource) {
        if (resource.document_type !== "FOLDER") return;
        setCurrentFolderId({ id: resource.document_id });
        setBreadCrumbLinks(prev => [...prev, resource]);
        setExpandedFolders(prev => ({ ...prev, [resource.document_id]: true }));
        fetchFolder(resource.document_id);
    }

    function openFromTree(folder) {
        setCurrentFolderId({ id: folder.document_id })
        setBreadCrumbLinks(prev => [...prev, folder]);
        setExpandedFolders(prev => ({ ...prev, [resource.document_id]: true }));
        fetchFolder(folder.document_id);
    }

    function goToRootFolder() {
        setCurrentFolderId({ id : folder.document_id });
        setBreadCrumbLinks([]);
        setResources(data[null] || []);
    }

    function goToBreadCrumbLink(index) {
        const path = breadCrumbLinks.slice(0, index + 1);
        setBreadCrumbLinks(path);
        setResources(data[path[index].document_id] || []);
    }

    function toggleFolders(folderId) {
        setExpandedFolders(prev => ({ ...prev, [folderId]: !prev[folderId] }));
    }

    return (
        <div className="fileResource">

            <FileHeader>
                <div className="tree-header">
                    <Tree parentId={null} data={data} expandedFolders={expandedFolders} toggleFolder={toggleFolders} onFolderSelect={openFromTree} activeFolderId={currentFolderId.id}></Tree>
                    <div className="breadCrumbs">
                        <span onClick={goToRootFolder}>My Folder</span>
                        {breadCrumbLinks.map((folder, index) => (
                            <span key={folder.document_id}>
                                {">"} <span className="link" onClick={() => goToBreadCrumbLink(index)}>{folder.document_name}</span>
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
                            <span className="fileName">{resource.filename||resource.resourceName}</span>
                        </div>
                        <span className="fileCreatedAt">{resource.createdTime || resource.createTime}</span>
                        <span className="fileLastModified">{resource.modifiedTime}</span>
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
        </div>
    );
}