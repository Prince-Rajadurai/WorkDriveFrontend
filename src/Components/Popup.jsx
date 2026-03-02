import '../Style/Popup.css';

export default function Popup({result , msg , show}){

    return(
        <>
            <div id = {show ? "show" : ""} className={result == 200 || result == 201 ? "success-msg" : "failed-msg"}>
                <img src={result == 200 ?"./../public/check.png":result == 201 ? "":"./../public/delete.png"} alt=""/>
                <p className='msg'>{msg}</p>
            </div>
        </>
    );
}