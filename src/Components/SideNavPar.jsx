import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { MdDashboard } from "react-icons/md";
import '../Style/SideNavPar.css';
import { useState } from 'react';
import DashBoard from './DashBoard';

export default function SideNavPar({ pageLink , page }) {

    const [showDashBoard, setShowDashboard] = useState(true);

    return (
        <>
            <div className="side-nav-parent">

                <div  style={page=="Dash Board" && {backgroundColor:"rgb(78, 78, 78)"}}
                    className="dash-board"
                    onClick={() => setShowDashboard(true)}
                >
                    <MdDashboard size={22} />
                    <p>Dashboard</p>
                </div>

                <div style={page=="My Folder"&& {backgroundColor:"rgb(78, 78, 78)"}}
                    className="my-folder"
                    onClick={() => { setShowDashboard(false), pageLink("Workspace") }}
                >
                    <Icon path={mdiFolderOutline} size={1} />
                    <p>My Folders</p>
                </div>



            </div>

            {showDashBoard && <DashBoard />}
        </>
    );
}
