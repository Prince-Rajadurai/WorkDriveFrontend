import Icon from '@mdi/react';

import {mdiFileOutline} from '@mdi/js'; 

export default function FileIcons({children}){

    return <Icon path={mdiFileOutline} size={1} color={"black"}/>;
}