const base_url = "http://localhost:8080/WorkDrive";

async function get(url) {
    const response = await fetch(`${base_url}${url}`, {
        method : "GET",
        credentials : "include"
    });
    return response.json();
}

export const getResources = (parentId) => {
    const query = parentId !== undefined && parentId !== null ? `?parentId=${parentId}` : "";
    return get(`/ResourceRenderServlet${query}`)
};