import '../Style/Popup.css';

export default function Popup({result , msg , show}){

    return(
        <>
            <div id = {show ? "show" : ""} className={result == 200 ? "success-msg" : "failed-msg"}>
                <p className='msg'>{msg}</p>
            </div>
        </>
    );
}