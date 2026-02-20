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
                {node.children.length > 0 && (
                    <Icon
                        path={expanded ? mdiChevronDown : mdiChevronRight}
                        size={0.7}
                        className="expand-icon"
                        onClick={() => setExpanded(!expanded)}
                    />
                )}
                <Icon path={mdiFolderOutline} size={0.8} />
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
            {treeData.length === 0 ? ( <div className="emptyTree">No folders</div> ) : (
                treeData.map(node => (
                    <TreeNode key={node.id} node={node} />
                ))
            )}
        </div>
    );
}