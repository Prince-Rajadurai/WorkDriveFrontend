import { useContext, useEffect, useState } from "react";
import { FoldContext } from "../utils/FolderContext";
import { getResources } from "../api/workdriveapi";
import Icon from '@mdi/react';
import { mdiFolderOutline } from '@mdi/js';
import '../Style/Tree.css';

export default function Tree() {
    const [folders, setFolders] = useState([]);
    const { setCurrentFolderId } = useContext(FoldContext);

    useEffect(() => {
        fetchFolders();
    }, []);

    async function fetchFolders() {
        try {
            const result = await getResources(null);
            const folders = result.resource.filter(r => r.type === "FOLDER");
            setFolders(folders);
        } catch (err) {
            console.error("Error in fetching folders", err);
        }
    }

    function openFolder(folder) {
        setCurrentFolderId({ id : folder.id });
    }

    return (<div className="tree">
        {folders.length === 0 && (<div className="emptyTree">No folders</div>)}
        {folders.map(folder => {
            <div key={folder.id}>
                <div key={folder.id} className="treeChild" onClick={() => openFolder(folder)}>
                    <Icon path={mdiFolderOutline} size={1} />
                    <span>{folder.resourceName}</span>
                </div>
            </div>
        })}
    </div>
    )
}