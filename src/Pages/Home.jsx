import Header from "../Components/Header";
import SideNavPar from "../Components/SideNavPar";
import AuthenticationContext from "../utils/AuthenticationContext";
import '../Style/Home.css'
import FileHeader from "../Components/FileHeader";
import ResourceListing from "../Components/ResourceListing";
import { FolderContext } from "../utils/FolderContext";

export default function Home() {

    return (

        <AuthenticationContext>
            <FolderContext>
                <div className="main">
                    <Header></Header>
                    <div className="container">
                        <SideNavPar></SideNavPar>
                        <FileHeader></FileHeader>
                        <ResourceListing></ResourceListing>
                    </div>
                </div>
            </FolderContext>
        </AuthenticationContext>

    );

}