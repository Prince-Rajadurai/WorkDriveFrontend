import Header from "../Components/Header";
import AuthenticationContext from "../utils/AuthenticationContext";
import '../Style/Home.css';
import SideNavPar from "../Components/SideNavPar";


export default function Home(){

    return(
        <>
            <AuthenticationContext>
                <div className="main">
                    <Header></Header>
                    <div className="container">
                        <SideNavPar></SideNavPar>
                    </div>
                </div>
            </AuthenticationContext>
        </>
    )

}