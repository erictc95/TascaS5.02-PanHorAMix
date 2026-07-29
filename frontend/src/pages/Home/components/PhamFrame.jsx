import "./PhamFrame.css";

function PhamFrame({ username }) {
    return (
        <div className="welcome-frame">

            <p className="welcome-title">

                WELCOME BACK

            </p>

            <div className="welcome-box">

                <div className="welcome-box">

                    <span className="welcome-corner welcome-top-left"></span>
                    <span className="welcome-corner welcome-top-right"></span>

                    <h1>@{username}</h1>

                    <span className="welcome-corner welcome-bottom-left"></span>
                    <span className="welcome-corner welcome-bottom-right"></span>

                </div>

            </div>

            <p className="welcome-subtitle">

                Ready for the Landscape Experience?

            </p>

        </div>
    );
}

export default PhamFrame;