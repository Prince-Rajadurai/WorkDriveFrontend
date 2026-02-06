import { useContext, useEffect, useState } from "react";
import { FoldContext } from "../utils/FolderContext";
import { getResources } from "../api/workdriveapi";
import Icon from '@mdi/react';
import { mdiFolderOutline } from '@mdi/js';
import '../Style/Tree.css';

export default function Tree() {
    const [folders, setFolders] = useState([]);
    const { currentFolderId, setCurrentFolderId } = useContext(FoldContext);
    const { breadCrumbLinks, setBreadCrumbLinks } = useContext(FoldContext);

    useEffect(() => {
        fetchFolders(currentFolderId.id);
    }, [currentFolderId.id]);

    async function fetchFolders(parentId) {
        try {
            const result = await getResources(parentId);
            const folders = result.resource.filter(r => r.type === "FOLDER");
            setCurrentFolderId({ id : result.folderId});
            setFolders(folders);
        } catch (err) {
            console.error("Error in fetching folders", err);
        }
    }

    function openFolder(folder) {
        setCurrentFolderId({ id: folder.id });
        setBreadCrumbLinks(prev => [ ...prev, { id : folder.id, name: folder.resourceName, type: "FOLDER"} ]);
    }

    return (<div className="treeStructure">
        {folders.length === 0 ? (
            <div className="emptyTree">No folders</div>
        ) : (
            folders.map(folder => {
                return (
                    <div key={folder.id} className="treeChild" onClick={() => openFolder(folder)}>
                        <Icon path={mdiFolderOutline} size={1} />
                        <span>{folder.resourceName}</span>
                    </div>
                );
            })
        )}
    </div>
    )
}