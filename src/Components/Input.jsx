import './../Style/Input.css';
import Button from './Button';
import { useState } from "react";

export default function Input({ children, placeholder, onClick, cancel,sendValue, submitBtn }) {

    const [value, setValue] = useState("");
    const [error, setError] = useState("");

    const validate = (val) => {
        if (val.trim() === "") {
            setError("Folder Name cannot be empty");
            return false;
        }
        setError("");
        return true;
    };

    const handleChange = (e) => {
        const val = e.target.value;
        setValue(val);
        if (validate(val)) {
            sendValue(val.trim());
        }
    }

    const handleSubmit = () => {
        if (validate(value)) {
            onClick();
        }
    }

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
                    <input id='input-field' type="text" placeholder={placeholder} onChange={handleChange} onKeyDown={pressSubmit} autoFocus/>
                    {error && <p className='errorMsg'>{error}</p>}
                </div>
                <div className='buttons'>
                    <Button className="inputButton" onClick={cancel} >Cancel</Button>
                    <Button className="inputButton" id="createButton" onClick={handleSubmit}>{submitBtn}</Button>
                </div>

            </div>
        </div>
    )
}