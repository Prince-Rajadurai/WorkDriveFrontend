import '../Style/UpdateButton.css';

export default function UpdateButton({ updateOnClick }){
    return(
        <button className="update-file-update-btn" onClick={ updateOnClick }>update</button>
    );
}