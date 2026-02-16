import './../Style/Input.css';
import Button from './Button';

export default function Input({ children, placeholder, onClick, cancel,sendValue, submitBtn }) {

    const pressSubmit = (e) =>{
        if(e.key == "Enter"){
            onClick();
        }
    }

    return (
        <div id='outerContainer'>
            <div className='innerContainer'>
                <h1 className='head-title'>{children}</h1>
                <div>
                    <p className='label'>Name</p>
                    <input id='input-field' type="text" placeholder={placeholder} onChange={(e)=>sendValue(e.target.value)} onKeyDown={pressSubmit}/>
                </div>
                <div className='buttons'>
                    <Button className="inputButton" onClick={cancel} >Cancel</Button>
                    <Button className="inputButton" id="createButton" onClick={onClick}>{submitBtn}</Button>
                </div>

            </div>
        </div>
    )
}