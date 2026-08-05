import "./PhamFrame.css";
import feedLogo from "../../../assets/brand/Panhoramix-feed-logo.png";

function PhamFrame({username}) {
    return (
        <div className="welcome-frame">

            <img
                src={feedLogo}
                alt="PanHorAMix"
                className="feed-logo"
            />

        </div>
    );
}

export default PhamFrame;