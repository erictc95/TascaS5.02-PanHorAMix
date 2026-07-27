import "./FocusFrame.css";

function FocusFrame({ username }) {
    return (
        <div className="focus-frame">

            <p className="focus-title">
                WELCOME BACK
            </p>

            <div className="focus-box">

                <span className="corner top-left"></span>
                <span className="corner top-right"></span>

                <h1>@{username}</h1>

                <span className="corner bottom-left"></span>
                <span className="corner bottom-right"></span>

            </div>

            <p className="focus-subtitle">
                Ready for the Landscape Experience?
            </p>

        </div>
    );
}

export default FocusFrame;