function ProfileHeader({ username, sceneCount, isOwnProfile = false }) {

    return (
        <div className="profile-header">

            <div className="profile-avatar">
                👤
            </div>

            <h1>
                @{username}
            </h1>

            <p>
                {sceneCount} Scene{sceneCount !== 1 ? "s" : ""}
            </p>

        </div>
    );
}

export default ProfileHeader;