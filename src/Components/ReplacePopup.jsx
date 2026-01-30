import '../Style/ReplacePopup.css';
import Button from './Button';

export default function ReplacePopup({ children , cancel , replace}) {
    return (
        <div id='outerContainer'>
            <div className='replaceContainer'>
                <h1 className='error-info'>File name "{children}" already exists in this folder.</h1>
                <div>
                    <p className='question'>do you want to replace it?</p>
                </div>
                <div className='buttons'>
                    <Button className="inputButton" onClick={cancel}>Cancel</Button>
                    <Button className="inputButton" id="replaceButton" onClick={replace}>Replace</Button>
                </div>

            </div>
        </div>
    );
}