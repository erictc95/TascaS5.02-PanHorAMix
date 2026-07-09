import "./PHButton.css";

function PHButton({
                      children,
                      className = "",
                      onClick,
                      type = "button",
                      disabled = false
                  }) {

    return (

        <button
            className={`ph-button ${className}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >

            {children}

        </button>

    );

}

export default PHButton;