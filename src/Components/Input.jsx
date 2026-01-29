import './Input.css';
import Button from './Button';

export default function Input({ children, placeholder, onClick, cancel }) {
    return (
        <div id='outerContainer'>
            <div className='innerContainer'>
                <h1 className='normalFont'>Create New {children}</h1>
                <div>
                    <p>Name</p>
                    <input type="text" placeholder={placeholder} />
                </div>
                <div className='buttons'>
                    <Button className="inputButton" onClick={cancel}>Cancel</Button>
                    <Button className="inputButton" id="createButton" onClick={onClick}>Create</Button>
                </div>

            </div>
        </div>
    )
}