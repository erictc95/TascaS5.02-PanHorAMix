import "./ProfileHeader.css";
import defaultAvatar from "../../assets/icons/default-avatar-icon.png";
import defaultBanner from "../../assets/placeholders/pham-banner-placeholder.png";

function ProfileHeader({
                           username,
                           sceneCount,
                           avatarUrl,
                           bannerUrl,
                           isOwnProfile = false
                       }) {

    return (
        <div className="profile-header">

            <div className="profile-banner">
                <img
                    src={bannerUrl || defaultBanner}
                    alt="Banner"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultBanner;
                    }}
                />
            </div>

            <div className="profile-avatar">
                <img
                    src={avatarUrl || defaultAvatar}
                    alt=""
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultAvatar;
                    }}
                />
            </div>

            <h1>@{username}</h1>

            <p>
                {sceneCount} Scene{sceneCount !== 1 ? "s" : ""}
            </p>

        </div>
    );
}

export default ProfileHeader;