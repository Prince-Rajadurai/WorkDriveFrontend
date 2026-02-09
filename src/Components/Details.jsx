import './../Style/Details.css';
import Icon from '@mdi/react';
import { mdiFileOutline, mdiFileTreeOutline, mdiFolderOutline } from '@mdi/js';

export default function DetailsPage({cancel, resource}) {
    console.log(resource);
    return (
            
            <div className='side-container'>
                <h1 id='details-title'><p>Details</p><button onClick={cancel}>X</button></h1>

                <div id='folder-name'>
                    <Icon path={mdiFolderOutline} size={1} />
                    <p>{resource.name}</p>
                </div>

                <div className="details-row">
                    <p>Type</p>
                    <p>Personal Space</p>
                </div>

                <div className="details-row">
                    <p>Created Time</p>
                    <p>{resource.created}</p>
                </div>

                <div className="details-row">
                    <p>Last Modified time</p>
                    <p>{resource.modified}</p>
                </div>

                <div className="details-row">
                    <p>Folders</p>
                    <p>{resource.folders} folders</p>
                </div>

                <div className="details-row">
                    <p>Files</p>
                    <p>{resource.files} files</p>
                </div>

                <div className="details-row">
                    <p>Size</p>
                    <p>{resource.size}</p>
                </div>
            </div>
    )
}