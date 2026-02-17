import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import '../Style/SideNavPar.css';
import DashBoard from './DashBoard';

export default function SideNavPar({ pageLink , page }) {

    return (
        <>
            <div className="side-nav-parent">

                <div  style={page=="Dash Board" ? {backgroundColor:"rgb(78, 78, 78)"}:{}}
                    className="dash-board"
                    onClick={() => {pageLink("Dashboard")}}
                >
                    <MdOutlineDashboard size={22} />
                    <p>Dashboard</p>
                </div>

                <div style={page=="My Folder" ? {backgroundColor:"rgb(78, 78, 78)"}:{}}
                    className="my-folder"
                    onClick={() => { pageLink("My Folders")  }}
                >
                    <Icon path={mdiFolderOutline} size={1} />
                    <p>My Folders</p>
                </div>



            </div>

        </>
    );
}
