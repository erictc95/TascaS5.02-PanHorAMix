import "./FrameButton.css";

function FrameButton({ children, onClick }) {

    return (

        <button
            className="frame-button"
            onClick={onClick}
        >

            <span className="frame-corner frame-top-left"></span>
            <span className="frame-corner frame-top-right"></span>

            <span className="frame-button-text">

                {children}

            </span>

            <span className="frame-corner frame-bottom-left"></span>
            <span className="frame-corner frame-bottom-right"></span>

        </button>

    );

}

export default FrameButton;