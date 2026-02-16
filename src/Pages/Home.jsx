import Header from "../Components/Header";
import SideNavPar from "../Components/SideNavPar";
import AuthenticationContext from "../utils/AuthenticationContext";
import '../Style/Home.css';
import { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import FileHeader from "../Components/FileHeader";
import ResourceListing from "../Components/ResourceListing";
import { FolderContext } from "../utils/FolderContext";
import AccountsPage from "../Components/Accounts";
import DashBoard from "../Components/DashBoard";

export default function Home() {

    const [page,setPage] = useState("My Folders");
    const navigate = useNavigate();

    useEffect(()=>{
        sessionCheck();
    },[]);
    
    async function sessionCheck(){
        try {
            const response = await fetch("http://localhost:8080/WorkDrive/SessionCheckFilter",{method: "GET",
            credentials: "include"});
            const data = await response.json();
            if (data.message !== "Session exsist") {
                navigate("/smartdrive/");
            }else{
                navigate("/smartdrive/home");
            }

        } catch (err) {
            console.log("Technical Issue");
        }
    }

    return (

        <AuthenticationContext>
            <FolderContext>
                <div className="main">
                    <Header pageLink={setPage} page={page}></Header>
                    <div className="container">
                        <SideNavPar pageLink={setPage}></SideNavPar>
                        {page == "My Folders" && <ResourceListing/>}
                        {page === "Accounts" && <AccountsPage/>}
                        {page === "Dash Board" && <DashBoard></DashBoard>}
                    </div>
                </div>
            </FolderContext>
        </AuthenticationContext>

    );

}