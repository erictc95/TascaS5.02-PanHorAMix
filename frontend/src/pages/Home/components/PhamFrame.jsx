import "./PhamFrame.css";

function PhamFrame({ username }) {
    return (
        <div className="pham-frame">

            <p className="pham-title">
                WELCOME BACK
            </p>

            <div className="pham-box">

                <span className="corner top-left"></span>
                <span className="corner top-right"></span>

                <h1>@{username}</h1>

                <span className="corner bottom-left"></span>
                <span className="corner bottom-right"></span>

            </div>

            <p className="pham-subtitle">
                Ready for the Landscape Experience?
            </p>

        </div>
    );
}

export default PhamFrame;