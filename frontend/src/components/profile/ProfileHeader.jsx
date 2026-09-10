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
                           firstName,
                           lastName,
                           bio,
                           role,
                           isOwnProfile = false
                       }) {

    const [menuOpen, setMenuOpen] = useState(false);
    const [languageOpen, setLanguageOpen] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/");
    };

    const [avatarActive, setAvatarActive] = useState(avatarEnabled);
    const [bannerActive, setBannerActive] = useState(bannerEnabled);
    const [overlapAvatar, setOverlapAvatar] = useState(true);

    const canOverlapBanner = bannerActive && !!bannerUrl;
    const shouldOverlap = canOverlapBanner && overlapAvatar;

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
                setLanguageOpen(false);
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

            {/* BANNER */}
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

            {/* PROFILE INFORMATION */}
            <div className="profile-info-layout">

                {/* LEFT — PERSONAL DETAILS */}
                <div className="profile-personal-info">

                    {(firstName || lastName) && (
                        <h2>
                            {[firstName, lastName]
                                .filter(Boolean)
                                .join(" ")}
                        </h2>
                    )}

                    {bio && (
                        <p className="profile-bio">
                            {bio}
                        </p>
                    )}

                </div>

                {/* CENTER — AVATAR + USERNAME + SCENES */}
                <div className="profile-center-info">

                    <div
                        className={`profile-avatar-wrapper ${
                            shouldOverlap
                                ? "avatar-overlap"
                                : "avatar-below-banner"
                        } ${isOwnProfile ? "clickable" : ""}`}
                        ref={menuRef}
                    >

                        <div
                            className="profile-avatar"
                            onClick={() => {
                                if (isOwnProfile) {
                                    setMenuOpen((prev) => {
                                        const newValue = !prev;

                                        if (!newValue) {
                                            setLanguageOpen(false);
                                        }

                                        return newValue;
                                    });
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
                                    setMenuOpen((prev) => {
                                        const newValue = !prev;

                                        if (!newValue) {
                                            setLanguageOpen(false);
                                        }

                                        return newValue;
                                    });
                                }
                            }}
                        >
                            <img
                                src={
                                    avatarActive && avatarUrl
                                        ? avatarUrl
                                        : defaultAvatar
                                }
                                alt=""
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = defaultAvatar;
                                }}
                            />
                        </div>

                        {/* ACCOUNT MENU */}
                        {isOwnProfile && menuOpen && (
                            <div className="profile-account-menu">

                                <div
                                    className="profile-toggle-option"
                                    onClick={handleAvatarToggle}
                                >
                                    <span>Activate Avatar</span>

                                    <span
                                        className={`profile-toggle ${
                                            avatarActive ? "active" : ""
                                        }`}
                                    >
                                    <span className="profile-toggle-knob"/>
                                </span>
                                </div>

                                <div
                                    className="profile-toggle-option"
                                    onClick={handleBannerToggle}
                                >
                                    <span>Activate Banner</span>

                                    <span
                                        className={`profile-toggle ${
                                            bannerActive ? "active" : ""
                                        }`}
                                    >
                                    <span className="profile-toggle-knob"/>
                                </span>
                                </div>

                                <div
                                    className={`profile-toggle-option ${
                                        !canOverlapBanner ? "disabled" : ""
                                    }`}
                                    onClick={() => {
                                        if (canOverlapBanner) {
                                            setOverlapAvatar(prev => !prev);
                                        }
                                    }}
                                >
                                    <span>Overlap Banner</span>

                                    <div
                                        className={`profile-toggle ${
                                            overlapAvatar && canOverlapBanner ? "active" : ""
                                        } ${!canOverlapBanner ? "disabled" : ""}`}
                                    >
                                        <div className="profile-toggle-knob"/>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleMenuAction("edit-profile")
                                    }
                                >
                                    Edit Profile
                                </button>

                                {role === "ADMIN" && (
                                    <button
                                        type="button"
                                        onClick={() => navigate("/admin")}
                                    >
                                        Admin Panel
                                    </button>
                                )}

                                <div className="profile-language-option">
                                    <button
                                        type="button"
                                        onClick={() => setLanguageOpen(prev => !prev)}
                                    >
                                        <span>Language</span>
                                        <span className={`language-arrow ${languageOpen ? "open" : ""}`}>
                                        ›
                                        </span>
                                    </button>

                                    {languageOpen && (
                                        <div className="profile-language-submenu">
                                            <button
                                                type="button"
                                                className="language-item active"
                                            >
                                                <svg
                                                    className="language-flag"
                                                    viewBox="0 0 60 40"
                                                    aria-hidden="true"
                                                >
                                                    <clipPath id="uk-flag-clip">
                                                        <rect width="60" height="40" rx="2"/>
                                                    </clipPath>

                                                    <g clipPath="url(#uk-flag-clip)">
                                                        <rect width="60" height="40" fill="#012169"/>

                                                        <path
                                                            d="M0 0L60 40M60 0L0 40"
                                                            stroke="#fff"
                                                            strokeWidth="10"
                                                        />

                                                        <path
                                                            d="M0 0L60 40M60 0L0 40"
                                                            stroke="#C8102E"
                                                            strokeWidth="5"
                                                        />

                                                        <path
                                                            d="M30 0V40M0 20H60"
                                                            stroke="#fff"
                                                            strokeWidth="14"
                                                        />

                                                        <path
                                                            d="M30 0V40M0 20H60"
                                                            stroke="#C8102E"
                                                            strokeWidth="8"
                                                        />
                                                    </g>
                                                </svg>

                                                <span>English</span>
                                                <span className="language-check">✓</span>
                                            </button>

                                            <button
                                                type="button"
                                                className="language-item disabled"
                                                disabled
                                            >
                                                <svg
                                                    className="language-flag"
                                                    viewBox="0 0 60 40"
                                                    aria-hidden="true"
                                                >
                                                    <rect width="60" height="40" rx="2" fill="#AA151B"/>
                                                    <rect y="10" width="60" height="20" fill="#F1BF00"/>
                                                </svg>

                                                <span>Español</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="disabled-menu-option"
                                    disabled
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
                                        onClick={() =>
                                            handleMenuAction("privacy-policy")
                                        }
                                    >
                                        Privacy Policy
                                    </button>

                                    <span>·</span>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleMenuAction("terms")
                                        }
                                    >
                                        Terms of Service
                                    </button>

                                </div>

                            </div>
                        )}

                    </div>

                    <h1>@{username}</h1>

                    <p className="profile-scene-count">
                        {sceneCount} Scene{sceneCount !== 1 ? "s" : ""}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default ProfileHeader;