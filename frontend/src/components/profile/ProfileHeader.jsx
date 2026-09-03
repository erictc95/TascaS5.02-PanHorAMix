import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import "./ProfileHeader.css";
import {updateAvatarEnabled, updateBannerEnabled} from "../../api/userService";
import defaultAvatar from "../../assets/icons/default-avatar-icon.png";
import defaultBanner from "../../assets/placeholders/pham-banner-placeholder.png";

function ProfileHeader({
                           username,
                           sceneCount,
                           avatarUrl,
                           bannerUrl,
                           avatarEnabled = false,
                           bannerEnabled = false,
                           isOwnProfile = false
                       }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const [avatarActive, setAvatarActive] = useState(avatarEnabled);
    const [bannerActive, setBannerActive] = useState(bannerEnabled);

    const handleAvatarToggle = async () => {
        const newValue = !avatarActive;

        console.log("Avatar toggle clicked:", newValue);

        try {
            await updateAvatarEnabled(newValue);
            console.log("Avatar updated successfully:", newValue);
            setAvatarActive(newValue);
        } catch (error) {
            console.error("Error updating avatar activation:", error);
        }
    };

    const handleBannerToggle = async () => {
        const newValue = !bannerActive;

        console.log("Banner toggle clicked:", newValue);

        try {
            await updateBannerEnabled(newValue);
            console.log("Banner updated successfully:", newValue);
            setBannerActive(newValue);
        } catch (error) {
            console.error("Error updating banner activation:", error);
        }
    };

    useEffect(() => {
        setAvatarActive(avatarEnabled);
        setBannerActive(bannerEnabled);
    }, [avatarEnabled, bannerEnabled]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        }

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const handleMenuAction = (action) => {

        if (action === "edit-profile") {
            navigate("/edit-profile");
            setMenuOpen(false);
        }

    };

    return (
        <div className="profile-header">

            <div className="profile-banner">
                <img
                    src={bannerActive && bannerUrl ? bannerUrl : defaultBanner}
                    alt="Banner"
                    onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = defaultBanner;
                    }}
                />
            </div>

            <div
                className={`profile-avatar-wrapper ${isOwnProfile ? "clickable" : ""}`}
                ref={menuRef}
            >
                <div
                    className="profile-avatar"
                    onClick={() => {
                        if (isOwnProfile) {
                            setMenuOpen((prev) => !prev);
                        }
                    }}
                    role={isOwnProfile ? "button" : undefined}
                    tabIndex={isOwnProfile ? 0 : undefined}
                    onKeyDown={(e) => {
                        if (
                            isOwnProfile &&
                            (e.key === "Enter" || e.key === " ")
                        ) {
                            e.preventDefault();
                            setMenuOpen((prev) => !prev);
                        }
                    }}
                >
                    <img
                        src={avatarActive && avatarUrl ? avatarUrl : defaultAvatar}
                        alt=""
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = defaultAvatar;
                        }}
                    />
                </div>

                {isOwnProfile && menuOpen && (
                    <div className="profile-account-menu">

                        <div
                            className="profile-toggle-option"
                            onClick={handleAvatarToggle}
                        >
                            <span>Activate Avatar</span>

                            <span className={`profile-toggle ${avatarActive ? "active" : ""}`}>
                                <span className="profile-toggle-knob"/>
                            </span>
                        </div>

                        <div
                            className="profile-toggle-option"
                            onClick={handleBannerToggle}
                        >
                            <span>Activate Banner</span>

                            <span className={`profile-toggle ${bannerActive ? "active" : ""}`}>
                                <span className="profile-toggle-knob"/>
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleMenuAction("edit-profile")}
                        >
                            Edit Profile
                        </button>

                        <button
                            type="button"
                            onClick={() => handleMenuAction("settings")}
                        >
                            Settings
                        </button>

                        <button
                            type="button"
                            onClick={() => handleMenuAction("change-password")}
                        >
                            Change Password
                        </button>

                        <div className="profile-menu-divider"/>

                        <button
                            type="button"
                            className="logout-option"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>

                        <div className="profile-menu-footer">
                            <button
                                type="button"
                                onClick={() => handleMenuAction("privacy-policy")}
                            >
                                Privacy Policy
                            </button>

                            <span>·</span>

                            <button
                                type="button"
                                onClick={() => handleMenuAction("terms")}
                            >
                                Terms of Service
                            </button>
                        </div>

                    </div>
                )}
            </div>

            <h1>@{username}</h1>

            <p>
                {sceneCount} Scene{sceneCount !== 1 ? "s" : ""}
            </p>

        </div>
    );
}

export default ProfileHeader;