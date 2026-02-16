import { mdiFolderOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { useState } from 'react';
import '../Style/SideNavPar.css';

export default function SideNavPar({pageLink}){

    return(
        <>
            <div className="side-nav-parent">
                <div className="my-folder" onClick={()=>pageLink("Workspace")}>
                    <Icon path={mdiFolderOutline} size={1} />
                    <p>My Folders</p>
                </div>
            </div>
        </>
    )

}