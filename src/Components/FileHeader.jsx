import './../Style/FileHeader.css';
import NewButton from './NewButton';

export default function FileHeader(){
    return (
        <div id='fileHeader'>
            <div id='tree-structure-view'></div>
            <div id='add-resource-new'>
                <NewButton></NewButton>
            </div>
        </div>
    )
}