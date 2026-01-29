import Header from "../Components/Header";
import SideNavPar from "../Components/SideNavPar";
import AuthenticationContext from "../utils/AuthenticationContext";
import '../Style/Home.css'
import FileHeader from "../Components/FileHeader";
import ResourceListing from "../Components/ResourceListing";

export default function Home(){

    return(

        <AuthenticationContext>
            <div className="main">
                <Header></Header>
                <div className="container">
                    <SideNavPar></SideNavPar>
                    <FileHeader></FileHeader>
                    <ResourceListing></ResourceListing>
                </div>
            </div>
        </AuthenticationContext>

    );

}