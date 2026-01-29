import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import '../Style/SideNavPar.css';
import Popup from './Popup';

export default function SideNavPar(){

    const[code , setCode] = useState(0);
    const[show , setShow] = useState(false);
    const[msg , setMsg] = useState("");

    function showMsg(){
        setCode(200);
        setMsg("✅ File created sucessfully");
        setShow(true);
        setTimeout(()=>{setShow(false)},2000)
    }

    return(
        <>
            <div className="side-nav-parent">
                <div className="my-folder" onClick={showMsg}>
                    <Icon path={mdiFolderOutline} size={1} />
                    <p>My Folders</p>
                </div>
            </div>
            <Popup result={code} msg={msg} show={show}></Popup>
        </>
    )

}