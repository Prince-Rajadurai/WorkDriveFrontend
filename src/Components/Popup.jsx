import '../Style/Popup.css';

export default function Popup({result , msg , show}){

    return(
        <>
            <div id = {show ? "show" : ""} className={result == 200 ? "success-msg" : "failed-msg"}>
                <img src={result == 200 ?"./../src/assets/check.png":"./../src/assets/delete.png"} alt=""/>
                <p className='msg'>{msg}</p>
            </div>
        </>
    );
}