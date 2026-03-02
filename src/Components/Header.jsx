import { mdiAccountOutline, mdiFolderOutline, mdiLogout } from '@mdi/js';
import Icon from '@mdi/react';
import { useEffect, useState } from 'react';
import '../Style/Header.css';
import { MdOutlineDashboard } from "react-icons/md";
import { FaRegTrashAlt } from "react-icons/fa";


export default function Header({pageLink, page}){

    const[name , setName] = useState("");
    const[isMenuOpen, setIsMenuOpen] = useState(false);

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

    async function logout() {
        await fetch("http://localhost:8080/WorkDrive/LogoutServlet", {
            method: "POST",
            credentials: "include"
        });
        window.location.href = "/smartdrive/";
    }

    return(
        <>
            <div className="headerParent">
                <div className="header">
                    <div className="logo-image" onClick={()=>{window.location.reload()}}>
                        <img src="../src/assets/image.png" alt="image not found" style={{height:"25px"}}/>
                        <h3>SmartDrive</h3>
                    </div>
                    <div className="visiting-option" onClick={(e)=>{if(e.target===e.currentTarget){setIsMenuOpen(false)}}}>
                        {page == "My Folders" && <Icon path={mdiFolderOutline} size={1} />}
                        {page == "Accounts" && <Icon path={mdiAccountOutline} size={1} />}
                        {page == "Dashboard" && <MdOutlineDashboard size={22}/>}
                        {page == "Trash" && <FaRegTrashAlt size={22}/>}
                        <p>{page}</p>
                    </div>
                    <div className="userName" onClick={(e)=>{if(e.target===e.currentTarget){setIsMenuOpen(false)}}}>
                        <h3 onClick={()=>setIsMenuOpen(!isMenuOpen)}>{name}</h3>
                        {isMenuOpen && <div className='profile-menu'>
                            <button onClick={()=>{pageLink("Accounts"); setIsMenuOpen(false);}} ><Icon path={mdiAccountOutline} size={0.8} /> My Account</button>
                            <button onClick={()=>{logout(); setIsMenuOpen(false);}}><Icon path={mdiLogout} size={0.8} /> Logout</button>
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );

}