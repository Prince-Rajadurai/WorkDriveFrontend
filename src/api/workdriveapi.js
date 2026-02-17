const base_url = "http://localhost:8080/WorkDrive";

async function get(url) {
    const response = await fetch(`${base_url}${url}`, {
        method : "GET",
        credentials : "include"
    });
    return response.json();
}
export const getResources = (parentId, folderCursor = 0, fileCursor = 0, limit = 20) => {
    let query = `folderCursor=${folderCursor}&fileCursor=${fileCursor}&limit=${limit}`;
    if (parentId !== null && parentId !== undefined) {
        query = `parentId=${parentId}&` + query;
    }
    return get(`/ResourceRenderServlet?${query}`);
};