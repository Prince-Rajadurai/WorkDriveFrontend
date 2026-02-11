

export default function Button({ children, onClick, className, id}) {
    return (
        <button id={id} className={className} onClick={onClick}>
            {children}
        </button>
    );
}
