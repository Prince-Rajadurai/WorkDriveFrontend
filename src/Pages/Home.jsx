import Header from "../Components/Header";
import SideNavPar from "../Components/SideNavPar";
import AuthenticationContext from "../utils/AuthenticationContext";
import '../Style/Home.css';
import { useEffect } from "react";
import {useNavigate} from "react-router-dom";
import FileHeader from "../Components/FileHeader";
import ResourceListing from "../Components/ResourceListing";
import { FolderContext } from "../utils/FolderContext";

export default function Home() {
    const navigate = useNavigate();

    useEffect(()=>{
        sessionCheck();
    },[]);
    
    async function sessionCheck(){
        try {
            const response = await fetch("http://localhost:8080/WorkDrive/SessionCheckFilter",{method: "GET",
            credentials: "include"});
            const data = await response.json();
            if (data.message === "Session exsist") {
                navigate("/home");
            } else {
                navigate("/");
            }

        } catch (err) {
            console.log("Technical Issue");
        }
    }

    return (

        <AuthenticationContext>
            <FolderContext>
                <div className="main">
                    <Header></Header>
                    <div className="container">
                        <SideNavPar></SideNavPar>
                        {/* <FileHeader></FileHeader> */}
                        <ResourceListing currentFolderId={currentFolderId} setCurrentFolderId={setCurrentFolderId}></ResourceListing>
                    </div>
                </div>
            </FolderContext>
        </AuthenticationContext>

    );

}