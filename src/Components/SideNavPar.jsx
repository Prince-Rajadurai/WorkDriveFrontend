import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { MdDashboard } from "react-icons/md";
import '../Style/SideNavPar.css';
import { useState } from 'react';
import DashBoard from './DashBoard';

export default function SideNavPar({pageLink}){

    const [showDashBoard , setShowDashboard ] = useState(false);

    return(
        <>
            <div className="side-nav-parent">
                
                <div 
                    className="my-folder" 
                    onClick={() => {setShowDashboard(false) , pageLink("Workspace")}}
                >
                    <Icon path={mdiFolderOutline} size={1} />
                    <p>My Folders</p>
                </div>

                <div 
                    className="dash-board" 
                    onClick={() => setShowDashboard(true)}
                >
                    <MdDashboard size={22}/>
                    <p>Dashboard</p>
                </div>

            </div>

            {showDashBoard && <DashBoard />}
        </>
    );
}
