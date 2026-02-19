import { useEffect, useState } from 'react';
import { BsFillTrash3Fill } from "react-icons/bs";
import { FaFileAlt, FaFolder } from "react-icons/fa";
import { LuTableProperties } from "react-icons/lu";
import { MdDeleteOutline, MdOutlineStorage } from "react-icons/md";
import { TbRestore } from "react-icons/tb";
import '../Style/Trash.css';
import Popup from './Popup';
import RestorePopup from './RestorePopup';

export default function Trash() {

    const [data , setData] = useState([]);
    const [code, setCode] = useState(0);
    const [show, setShow] = useState(false);
    const [msg, setMsg] = useState("");

    const[size , setSize] = useState("0 B");
    const[items , setTotalsItems] = useState(0);
    const[files , setFiles] = useState(0);
    const[folders , setFolders] = useState(0);

    const[fileId , setFileId] = useState("");
    const[folderId , setFolderId] = useState("");
    const[showRestore , setShowRestore] = useState(false);

    useEffect(()=>{
        showTrashData();
    },[msg,code,show]);

    async function showTrashData(){

        let res = await fetch("http://localhost:8080/WorkDrive/ShowTrash",{
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

    async function restore(id , folderId , replace){
        let res = await fetch("http://localhost:8080/WorkDrive/RestoreServlet?fileId="+id+"&&folderId="+folderId+"&&replace="+replace,{
            method: "GET",
            credentials: "include",
        });

        let data = await res.json();

        if (data.StatusCode == 200) {
            showResult(data.StatusCode, "File restore successfully", true, true);
            
        }
        if(data.StatusCode == 300){
            setFileId(id);
            setFolderId(folderId);
            setShowRestore(true);
        }
        if (data.StatusCode == 400) {
            showResult(data.StatusCode, "File restore Failed", true)
        }

        
    }

    async function remove(folderId,fileName){

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

    

    function replace(){
        setShowRestore(false);
        restore(fileId , folderId , true);
    }

    function showResult(Code, msg, chk) {
        setCode(Code);
        setMsg(msg);
        setShow(chk);
        setTimeout(() => { setShow(false) }, 2000)
     }

     function cancel(){
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
                            {data.map((res , index)=>(
                                <tr className='trash-row' key={index}>
                                    <td>{res.name}</td>
                                    <td>{res.time}</td>
                                    <td>{res.size}</td>
                                    <td className='trash-action'><TbRestore size={40} className='trash-restore' onClick={()=>restore(res.ResourceId,res.folderId,false)}/><MdDeleteOutline size={40} className='trash-delete' onClick={()=>remove(res.folderId,res.name)}/></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Popup result={code} msg={msg} show={show}></Popup>
            </div>
            {showRestore&&<RestorePopup replace={replace} skip={cancel}></RestorePopup>}
        </>
    );
}