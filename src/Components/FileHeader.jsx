import './../Style/FileHeader.css';
import NewButton from './NewButton';

export default function FileHeader({children}){
    return (
        <div id='fileHeader'>
            <div id='tree-structure-view'>
                {children}
            </div>
            <div id='add-resource-new'>
                <NewButton></NewButton>
            </div>
        </div>
    )
}