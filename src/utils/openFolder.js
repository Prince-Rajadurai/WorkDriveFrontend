export function openFolder(resource, folderTree, setCurrentFolderId, setBreadCrumbLinks, setExpandedFolders) {
    if (resource.type !== "FOLDER") return;
    function findNode(nodes, targetId) {
        if (!nodes || !nodes.length) return null;
        for (const node of nodes) {
            if (String(node.id) === String(targetId)) return node;
            if (node.children.length) {
                const found = findNode(node.children, targetId);
                if (found) return found;
            }
        }
        return null;
    }
    const node = findNode(folderTree, resource.resourceId);
    setCurrentFolderId({ id: resource.id });
    if (node) {
        setBreadCrumbLinks(node.path);
        setExpandedFolders(node.path.map(p => p.id));
    } else {
        setBreadCrumbLinks([{id:resource.resourceId, name:resource.resourceName}]);
        setExpandedFolders([]);
    }; 
}