import "./Toast.css";

function Toast({ visible, title, message, type }) {

    if (!visible) return null;

    return (

        <div className={`pham-toast ${type}`}>

            <div className="pham-toast-title">

                {title}

            </div>

            <div className="pham-toast-message">

                {message}

            </div>

            <div className="pham-toast-progress"></div>

        </div>

    );

}

export default Toast;