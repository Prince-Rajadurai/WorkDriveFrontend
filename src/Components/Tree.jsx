import Icon from "@mdi/react";
import { mdiFolderOutline, mdiChevronDown, mdiChevronRight } from "@mdi/js";

export default function Tree({ parentId, data, expandedFolders, toggleFolder, onFolderSelect, level = 0 }) {
    const folders = (data[parentId] || []).filter(
        item => item.document_type === "FOLDER"
    );

    if (folders.length === 0) return null;

    return (
        <div className="treeLevel">
            {folders.map(folder => {
                const hasChildren = (data[folder.document_id] || []).some(
                    item => item.document_type === "FOLDER"
                );

                return (
                    <div key={folder.document_id}>
                        <div
                            className="treeRow"
                            style={{ paddingLeft: `${level * 16}px` }}
                            onClick={() => onFolderSelect(folder)}
                        >
                            {hasChildren ? (
                                <span
                                    className="treeArrow"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFolder(folder.document_id);
                                    }}
                                >
                                    <Icon
                                        path={
                                            expandedFolders[folder.document_id]
                                                ? mdiChevronDown
                                                : mdiChevronRight
                                        }
                                        size={0.8}
                                    />
                                </span>
                            ) : (
                                <span className="treeArrowPlaceholder" />
                            )}

                            <Icon
                                path={mdiFolderOutline}
                                size={0.9}
                                color="#1E52BB"
                            />

                            <span
                                className="treeFolderName"
                                onClick={() => onFolderSelect(folder)}
                            >
                                {folder.document_name}
                            </span>
                        </div>

                        {expandedFolders[folder.document_id] && (
                            <Tree
                                parentId={folder.document_id}
                                data={data}
                                expandedFolders={expandedFolders}
                                toggleFolder={toggleFolder}
                                onFolderSelect={onFolderSelect}
                                level={level + 1}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}