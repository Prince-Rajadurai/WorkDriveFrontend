import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import '../Style/SideNavPar.css';
import DashBoard from './DashBoard';

export default function SideNavPar({ pageLink, page }) {

    return (
        <>
            <div className="side-nav-parent">

                <div style={page == "My Folders" ? { backgroundColor: "#293B5F" } : {}}
                    className="my-folder"
                    onClick={() => { pageLink("My Folders") }}
                >
                    <Icon path={mdiFolderOutline} size={1} />
                    <p>My Folders</p>
                </div>

                <div style={page == "Dash Board" ? { backgroundColor: "#293B5F" } : {}}
                    className="dash-board"
                    onClick={() => { pageLink("Dash Board") }}
                >
                    <MdOutlineDashboard size={22} />
                    <p>Dashboard</p>
                </div>



            </div>

        </>
    );
}
