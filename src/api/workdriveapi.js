const base_url = "http://localhost:8080/WorkDrive";
async function post(url, payload) {
    const response = await fetch(`${base_url}${url}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify(payload)
    });
    return response.json();
}

export const getResources = (parentId) => post("/ResourceRenderServlet", {parentId});