import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import '../Style/SideNavPar.css';
import DashBoard from './DashBoard';

export default function SideNavPar({ pageLink }) {

    return (
        <>
            <div className="side-nav-parent">

                <div
                    className="dash-board"
                    onClick={() => {pageLink("Dash Board")}}
                >
                    <MdOutlineDashboard size={22} />
                    <p>Dashboard</p>
                </div>

                <div
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
