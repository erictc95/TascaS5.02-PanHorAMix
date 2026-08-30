import "./ProfileGrid.css";
import { Link } from "react-router-dom";
import phamVideoPlaceholder from "../../assets/placeholders/pham-video-placeholder.png";
import SceneStatus from "../scene/SceneStatus.jsx";

function ProfileGrid({ media }) {
    return (
        <div className="profile-grid">
            {media.map((scene) => {

                const imageSrc =
                    scene.mediaType === "VIDEO"
                        ? (scene.thumbnailUrl?.trim()
                            ? scene.thumbnailUrl
                            : phamVideoPlaceholder)
                        : scene.mediaUrl;

                return (
                    <Link
                        key={scene.id}
                        to={`/media/${scene.id}`}
                        className="profile-card"
                    >
                        <div className="profile-card-status">
                            <SceneStatus visibility={scene.visibility} />
                        </div>

                        <img
                            src={imageSrc}
                            alt={scene.title}
                        />

                        <h3>
                            {scene.title}
                        </h3>
                    </Link>
                );
            })}
        </div>
    );
}

export default ProfileGrid;