import { useEffect, useState, useContext } from "react";
import { FoldContext } from "../utils/FolderContext";
import { getResources } from "../api/workdriveapi";
import Icon from "@mdi/react";
import { mdiFolderOutline, mdiChevronDown, mdiChevronRight } from "@mdi/js";
import "../Style/Tree.css";

async function buildTree(parentId = null, parentPath = []) {
    const res = await getResources(parentId, 0, 0, 1000);
    const folders = (res.resources || []).filter(r => r.type === "FOLDER");
    return Promise.all(
        folders.map(async folder => {
            const currentPath = [...parentPath, { id: folder.id, name: folder.name }];
            return {
                id: folder.id,
                name: folder.name,
                path: currentPath,
                children: await buildTree(folder.id, currentPath)
            };
        })
    );
}

function TreeNode({ node }) {
    const { setCurrentFolderId, setBreadCrumbLinks } = useContext(FoldContext);
    const [expanded, setExpanded] = useState(false);
    const openFolder = () => {
        setCurrentFolderId({ id: node.id });
        setBreadCrumbLinks(node.path);
    };
    return (
        <div className="tree-node">
            <div className="tree-row">
                <div className="arrowIcon">
                    {node.children.length > 0 && (
                        <Icon
                            path={expanded ? mdiChevronDown : mdiChevronRight}
                            size={0.7}
                            className="expand-icon"
                            onClick={() => setExpanded(!expanded)}
                        />
                    )}
                </div>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none"> <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg>
                <span className="tree-name" onClick={openFolder}>
                    {node.name}
                </span>
            </div>
            {expanded && (
                <div className="tree-children">
                    {node.children.map(child => (
                        <TreeNode key={child.id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Tree() {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        loadTree();
    }, []);
    async function loadTree() {
        try {
            const data = await buildTree(null);
            setTreeData(data);
        } catch (err) {
            console.error("Tree build failed", err);
        } finally {
            setLoading(false);
        }
    }
    if (loading) return <div className="tree-loading">Loading...</div>;
    return (
        <div className="treeStructure">
            {treeData.length === 0 ? (<div className="emptyTree">No folders</div>) : (
                treeData.map(node => (
                    <TreeNode key={node.id} node={node} />
                ))
            )}
        </div>
    );
}