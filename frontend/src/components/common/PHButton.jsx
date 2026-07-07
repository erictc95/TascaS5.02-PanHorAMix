import "./PHButton.css";

function PHButton({
    children,
    className = "",
    onClick,
    type = "button"
}) {

    return (

        <button
            className={`ph-button ${className}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>

    );

}

export default PHButton;