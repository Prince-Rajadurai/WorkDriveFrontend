import { useState, useRef } from "react";
import Icon from '@mdi/react';
import { mdiFileTree, mdiSort, mdiFileOutline, mdiFolderOutline } from '@mdi/js';


export default function ResourceListing() {
    const [data, setData] = useState({});
    const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
    const [resources, setResources] = useState([]);
    const [operationsMenu, setOperationsMenu] = useState([]);
    const [renameResource, setRenameResource] = useState();
    const [renameValue, setRenameValue] = useState();

    const [showTreeView, setShowTreeView] = useState(false);
    const [showSortByView, setShowSortByView] = useState(false);
    const [showRename, setShowRename] = useState(false);

    const treeViewRef = useRef(null);
    const sortingSpaceRef = useRef(null);

    function goToRootFolder() { 
        const path = link.slice(0, index + 1);
        setLink(path);
        setResources(data[path[index].document_id]);
    }

    function goToBreadCrumbLink(index) { 
        const path = link.slice(0, index + 1);
        setBreadCrumbLinks(path);
        setResources(data);
    }

    function sortResources(type, order = "asc") { }

    function openFolder(resource) { }

    function renameFolder() { }

    return (
        <div className="resourceListing">

            <div className="links">
                <div className="treeView" ref={treeViewRef} onClick={() => setShowTreeView(true)}>
                    <Icon path={mdiFileTree} size={1} />
                </div>
            
                <div className="breadCrumb">
                    <span onClick={goToRootFolder}>My Folder</span>
                    { breadCrumbLinks.map((resource, index) => (
                        <span key={resource.resourceId}>{" > "}<span onClick={goToBreadCrumbLink(index)}>{resource.resourceName}</span></span>
                    )) }
                </div>
            </div>
            
            <div className="sortingSpace" ref={sortingSpaceRef}>
                <Icon path={mdiSort} size={1} onClick={() => setShowSortByView(prev => !prev)} />
            
                {showSortByView && (<div className="sortByDropDown">
                    <div className="sortByDropDownItem" onClick={sortResources("name", "asc")}>Name (A - Z)</div>
                    <div className="sortByDropDownItem" onClick={sortResources("name", "desc")}>Name (Z - A)</div>
                    <div className="sortByDropDownItem" onClick={sortResources("createdAt", "asc")}>Created At (Oldest - Newest)</div>
                    <div className="sortByDropDownItem" onClick={sortResources("createdAt", "desc")}>Created At (Newest - Oldest)</div>
                    <div className="sortByDropDownItem" onClick={sortResources("lastModifiedAt", "asc")}>Last Modified (Oldest - Newest)</div>
                    <div className="sortByDropDownItem" onClick={sortResources("lastModifiedAt", "desc")}>Last Modifies (Newest - Oldest)</div>
                    <div className="sortByDropDownItem" onClick={sortResources("size", "asc")}>Size (Low - High)</div>
                    <div className="sortByDropDownItem" onClick={sortResources("size", "desc")}>Size (High - Low)</div>
                </div>)}
            </div>
            
            <div className="fileMetaDataHeading">
                <span className="name">Name</span>
                <span className="createdAt">Created At</span>
                <span className="lastModified">Last Modified</span>
                <span className="size">Size</span>
            </div>

            <div className="Resources">
                { resources.length === 0 && (
                    <div className="empty">
                        <img src="../src/assets/empty.svg" alt="emptyFolder" />
                        No Items Available
                    </div>
                ) }
                { resources.map(resource => (
                    <div className="resource" key={resource.resourceId} onClick={() => openFolder(resource)}>
                        <div className="name">
                            <span className="resourceIcon">
                                {resource.resourceType === "FOLDER" ? <Icon path={mdiFileOutline} size={1} /> : <Icon path={mdiFolderOutline} size={1} />}
                            </span>
                            <span className="resourceName">{resource.resourceName}</span>
                        </div>
                        <span className="resourceCreatedAt">{resource.resourceCreatedAt}</span>
                        <span className="resourceLastModified">{resource.resourceLastModified}</span>
                        <span className="resourceSize">{resource.resourceSize}</span>
                        <span className="resourceOperations" onContextMenu={(e) => {
                            e.preventDefault();
                            setOperationsMenu({
                                x : e.pageX,
                                y : e.pageY,
                                resource
                            })
                        }}>⋮</span>
                    </div>
                )) }
            </div>
            
            { showTreeView && (
                <div className="dropDownBox" onClick={() => setShowTreeView(false)}>
                    <div className="box" onClick={e => e.stopPropagation()} ref={treeViewRef}>

                    </div>
                </div>
            ) }

            { operationsMenu && (
                <div className="operationDropdownBox" style={{ top : operationDropdownBox.y, left : `calc(189% - ${operationsMenu.x}px)`}} onClick={() => setOperationsMenu(null)}>
                    <div className="operationsDropdownItem" onClick={() => { setOperationsMenu(null) }}> Copy </div>
                    <div className="operationsDropdownItem" onClick={() => { setOperationsMenu(null) }}> Move </div>
                    <div className="operationsDropdownItem" onClick={() => { setOperationsMenu(null) }}> Paste </div>
                    <div className="operationsDropdownItem" onClick={() => { setOperationsMenu(null) }}> Delete </div>
                    <div className="operationsDropdownItem" onClick={() => { setRenameResource(operationsMenu.resource);
                        setRenameValue(operationsMenu.resource.resourceName);
                        setShowRename(true);
                        setOperationsMenu(null); 
                    }}> Rename </div>
                    <div className="operationsDropdownItem" onClick={() => { setOperationsMenu(null) }}>Download</div>
                </div>
            ) }

            { showRename && (
                <div className="renameBox" onClick={() => setShowRename(false)}>
                    <div className="box" onClick={e => e.stopPropagation()}>
                        <h3>Rename Folder</h3>
                        <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus></input>
                        <div className="boxAction">
                            <button onClick={() => setShowRename(false)}>Cancel</button>
                            <button onClick={renameFolder}>Rename</button>
                        </div>
                    </div>
                </div>
            ) }
        </div>
    );
}