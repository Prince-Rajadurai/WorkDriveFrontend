import '../Style/SkipButton.css'

export default function SkipButton({ skipOnClick }){
    return(
        <button className="update-file-skip-btn" onClick={ skipOnClick }>skip</button>
    );
}