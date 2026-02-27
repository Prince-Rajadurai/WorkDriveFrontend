import { createContext, useContext, useState } from "react";

export const FoldContext = createContext();

export function FolderContext({children}) {
    const [currentFolderId, setCurrentFolderId] = useState({ id: null });
    const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
    const [folderTree, setFolderTree] = useState([]);
    const [expandedFolders, setExpandedFolders] = useState([]);
    return (
        <FoldContext.Provider value={{currentFolderId, setCurrentFolderId, breadCrumbLinks, setBreadCrumbLinks, folderTree, setFolderTree, expandedFolders, setExpandedFolders}}>
            {children}
        </FoldContext.Provider>
    );
}