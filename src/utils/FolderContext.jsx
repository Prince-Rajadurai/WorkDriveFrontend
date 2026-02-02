import { createContext, useContext, useState } from "react";

export const FoldContext = createContext();

export function FolderContext({children}) {
    const [currentFolderId, setCurrentFolderId] = useState({ id: null });
    return (
        <FoldContext.Provider value={{currentFolderId, setCurrentFolderId}}>
            {children}
        </FoldContext.Provider>
    );
}