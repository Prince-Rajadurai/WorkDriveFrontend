import { useEffect, useState } from 'react';
import { BsFillTrash3Fill } from "react-icons/bs";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { LuTableProperties } from "react-icons/lu";
import { MdDeleteOutline, MdOutlineStorage } from "react-icons/md";
import { TbRestore } from "react-icons/tb";
import '../Style/Trash.css';
import FileIcons from './FileIcons';
import Popup from './Popup';
import RestorePopup from './RestorePopup';

export default function Trash() {

    const [data, setData] = useState([]);
    const [code, setCode] = useState(0);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState("");

    const [size, setSize] = useState("0 B");
    const [items, setTotalsItems] = useState(0);
    const [files, setFiles] = useState(0);
    const [folders, setFolders] = useState(0);

    const [fileId, setFileId] = useState("");
    const [folderId, setFolderId] = useState("");
    const [showRestore, setShowRestore] = useState(false);

    useEffect(() => {
        showTrashData();
    }, [msg, code, show]);

    async function showTrashData() {

        let res = await fetch("http://localhost:8080/WorkDrive/ShowTrash", {
            method: "GET",
            credentials: "include",
        });

        let data = await res.json();

        setSize(data.size);

        setTotalsItems(data.totalItems);

        setFiles(data.files);

        setFolders(data.folders);

        setData(data.resources);

    }

    async function restore(id, folderId, replace) {
        let res = await fetch("http://localhost:8080/WorkDrive/RestoreServlet?fileId=" + id + "&&folderId=" + folderId + "&&replace=" + replace, {
            method: "GET",
            credentials: "include",
        });

        let data = await res.json();

        if (data.StatusCode == 200) {
            showResult(data.StatusCode, "File restore successfully", true, true);

        }
        if (data.StatusCode == 300) {
            setFileId(id);
            setFolderId(folderId);
            setShowRestore(true);
        }
        if (data.StatusCode == 400) {
            showResult(data.StatusCode, "File restore Failed", true)
        }


    }

    async function remove(folderId,fileId, fileName, type) {
        if (type === "FILE") {
            const response = await fetch("http://localhost:8080/WorkDrive/DeleteFileServlet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ filename: fileName, folderId })
            });

            let data = await response.json();

            if (data.StatusCode == 200) {
                showResult(data.StatusCode, "File deleted successfully", true, true);

            }
            if (data.StatusCode >= 400) {
                showResult(data.StatusCode, "File delete Failed", true)
            }
        }
        else{
            const response = await fetch("http://localhost:8080/WorkDrive/FolderServlet", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ resourceId: fileId })
            });

            let data = await response.json();

            if (data.StatusCode == 200) {
                showResult(data.StatusCode, "File deleted successfully", true, true);

            }
            if (data.StatusCode >= 400) {
                showResult(data.StatusCode, "File delete Failed", true)
            }
        }

    }



    function replace() {
        setShowRestore(false);
        restore(fileId, folderId, true);
    }

    function showResult(Code, msg, chk) {
        setCode(Code);
        setMsg(msg);
        setShow(chk);
        setTimeout(() => { setShow(false) }, 2000)
    }

    function cancel() {
        setShowRestore(false);
    }

    return (
        <>
            <div className="trash-main">
                <div className="trash-heading">
                    <BsFillTrash3Fill size={40} className='trash-icon' />
                    <h2>Trash</h2>
                </div>
                <div className="trash-containers">
                    <div className="trash-cart">
                        <div className="trash-cart-des">
                            <h3>Files</h3>
                            <p>{files}</p>
                        </div>
                        <FaFileAlt className='fileIcon' size={40} />
                    </div>
                    <div className="trash-cart">
                        <div className="trash-cart-des">
                            <h3>Folders</h3>
                            <p>{folders}</p>
                        </div>
                        <FaFolder className='folderIcon' size={40} />
                    </div>
                    <div className="trash-cart">
                        <div className="trash-cart-des">
                            <h3>Size</h3>
                            <p>{size}</p>
                        </div>
                        <MdOutlineStorage className='storageIcon' size={40} />
                    </div>
                    <div className="trash-cart">
                        <div className="trash-cart-des">
                            <h3>Items</h3>
                            <p>{items}</p>
                        </div>
                        <LuTableProperties className='itemIcon' size={40} />
                    </div>
                </div>
                <div className="trash-item-view">
                    <table className='trash-table'>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Date</th>
                                <th>Size</th>
                                <th className='action'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((res, index) => (
                                <tr className='trash-row' key={index}>
                                    <td className='trash-file-name'>{res.type === "FOLDER" ? <svg width={24} height={24} viewBox="0 0 24 24" fill="none"> <path d="M13 7L11.8845 4.76892C11.5634 4.1268 11.4029 3.80573 11.1634 3.57116C10.9516 3.36373 10.6963 3.20597 10.4161 3.10931C10.0992 3 9.74021 3 9.02229 3H5.2C4.0799 3 3.51984 3 3.09202 3.21799C2.71569 3.40973 2.40973 3.71569 2.21799 4.09202C2 4.51984 2 5.0799 2 6.2V7M2 7H17.2C18.8802 7 19.7202 7 20.362 7.32698C20.9265 7.6146 21.3854 8.07354 21.673 8.63803C22 9.27976 22 10.1198 22 11.8V16.2C22 17.8802 22 18.7202 21.673 19.362C21.3854 19.9265 20.9265 20.3854 20.362 20.673C19.7202 21 18.8802 21 17.2 21H6.8C5.11984 21 4.27976 21 3.63803 20.673C3.07354 20.3854 2.6146 19.9265 2.32698 19.362C2 18.7202 2 17.8802 2 16.2V7Z" stroke="black" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" /> </svg> : <FileIcons>{res.name}</FileIcons>}{res.name}</td>
                                    <td>{res.time}</td>
                                    <td>{res.size}</td>
                                    <td className='trash-action'><TbRestore size={40} className='trash-restore' onClick={() => restore(res.ResourceId, res.folderId, false)} /><MdDeleteOutline size={40} className='trash-delete' onClick={() => remove(res.folderId , res.ResourceId, res.name, res.type)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Popup result={code} msg={msg} show={show}></Popup>
            </div>
            {showRestore && <RestorePopup replace={replace} skip={cancel}></RestorePopup>}
        </>
    );
}