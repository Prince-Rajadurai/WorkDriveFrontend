import { createContext, useContext, useState } from "react";

export const FolderIdContext = createContext();

export function FolderContext ({ children }) {
    const [currentFolderId, setCurrentFolderId] = useState({ id : null});
    return (
        <>
            <FolderIdContext.Provider value={{currentFolderId, setCurrentFolderId}}>{children}</FolderIdContext.Provider>
        </>
    )
}

export function useFolder() {
    return useContext(FolderIdContext);
}