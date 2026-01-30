import './../Style/Input.css';
import Button from './Button';

export default function Input({ children, placeholder, onClick, cancel,sendValue }) {

    function createResource(){
        onClick();
        cancel();
    }
    return (
        <div id='outerContainer'>
            <div className='innerContainer'>
                <h1 className='head-title'>Create New {children}</h1>
                <div>
                    <p className='label'>Name</p>
                    <input className='input-field' type="text" placeholder={placeholder} onChange={(e)=>sendValue(e.target.value)}/>
                </div>
                <div className='buttons'>
                    <Button className="inputButton" onClick={cancel}>Cancel</Button>
                    <Button className="inputButton" id="createButton" onClick={createResource}>Create</Button>
                </div>

            </div>
        </div>
    )
}