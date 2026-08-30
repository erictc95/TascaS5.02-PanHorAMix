import "./ProfileGrid.css";
import { Link } from "react-router-dom";

function ProfileGrid({ media }) {
    return (
        <div className="profile-grid">
            {media.map((item) => (
                <Link
                    key={item.id}
                    to={`/media/${item.id}`}
                    className="profile-grid-item"
                >
                    <img
                        src={item.mediaUrl}
                        alt={item.title || "Scene"}
                    />
                </Link>
            ))}
        </div>
    );
}

export default ProfileGrid;