import { mdiAccountOutline, mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useState } from 'react';
import '../Style/Header.css';
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";


export default function Header({pageLink, page}){


    const[name , setName] = useState("");

    useEffect(()=>{
        getUserName();
    },[]);

    async function getUserName(){
        let response = await fetch("http://localhost:8080/WorkDrive/RenderUserMail" , {method: "GET",
        credentials: "include"});
        let data = await response.json();
        let userMail = data.message;
        setName(userMail.split("")[0].toUpperCase());
    }

    return(
        <>
            <div className="headerParent">
                <div className="header">
                    <div className="logo-image">
                        <img src="../src/assets/image.png" alt="image not found" style={{height:"25px"}}/>
                        <h3>SmartDrive</h3>
                    </div>
                    <div className="visiting-option">
                        {(page == "My Folders") && <Icon path={mdiFolderOutline} size={1} />}
                        {page == "Accounts" && <Icon path={mdiAccountOutline} size={1} />}
                        {page == "Dashboard" && <MdOutlineDashboard size={22}/>}
                        {page == "Trash" && <FaRegTrashAlt size={22}/>}
                        <p>{page}</p>
                    </div>
                    <div className="userName">
                        <h3 onClick={()=>pageLink("Accounts")}>{name}</h3>
                    </div>
                </div>
            </div>
        </>
    );

}