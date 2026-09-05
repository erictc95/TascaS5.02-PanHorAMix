import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getProfile, updateProfile} from "../../api/userService";
import defaultAvatar from "../../assets/icons/default-avatar-icon.png";
import "./EditProfilePage.css";
import DirectorNote from "../Upload/components/DirectorNote";
import { useToast } from "../../context/ToastContext";

function EditProfilePage() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        bio: ""
    });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarValidation, setAvatarValidation] = useState(null);
    const [avatarRemoved, setAvatarRemoved] = useState(false);
    const [originalAvatarUrl, setOriginalAvatarUrl] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const [bannerPreview, setBannerPreview] = useState(null);
    const [bannerValidation, setBannerValidation] = useState(null);
    const [bannerRemoved, setBannerRemoved] = useState(false);
    const [originalBannerUrl, setOriginalBannerUrl] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    const [toast, setToast] = useState({
        visible: false,
        title: "",
        message: "",
        type: ""
    });

    useEffect(() => {
        async function loadProfile() {

            try {
                const data = await getProfile();

                setProfile({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    bio: data.bio || ""
                });

                setOriginalAvatarUrl(data.avatarUrl || null);
                setAvatarPreview(data.avatarUrl || null);
                setAvatarRemoved(false);

                setOriginalBannerUrl(data.bannerUrl || null);
                setBannerPreview(data.bannerUrl || null);
                setBannerRemoved(false);

            } catch (error) {
                console.error("Error loading profile:", error);

            } finally {
                setLoading(false);
            }
        }

        loadProfile();

    }, []);

    function handleChange(event) {

        const {name, value} = event.target;

        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleAvatarChange(event) {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const maxSize = 10 * 1024 * 1024;
        const minimumWidth = 300;
        const minimumHeight = 300;

        if (!allowedTypes.includes(file.type)) {
            setAvatarValidation({
                type: "error",
                title: "Avatar rejected",
                message: "Unsupported image format. Allowed formats: JPG, JPEG, PNG and WebP."
            });

            return;
        }

        if (file.size > maxSize) {
            setAvatarValidation({
                type: "error",
                title: "Avatar rejected",
                message: "The image is too large. Maximum allowed size is 10 MB."
            });

            return;
        }

        const imageUrl = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {

            if (
                image.width < minimumWidth ||
                image.height < minimumHeight
            ) {
                URL.revokeObjectURL(imageUrl);

                setAvatarValidation({
                    type: "error",
                    title: "Avatar rejected",
                    message: `The image resolution is too low. Minimum required: ${minimumWidth} × ${minimumHeight} px.`
                });

                return;
            }

            setAvatarPreview(imageUrl);
            setAvatarFile(file);
            setAvatarRemoved(false);

            setAvatarValidation({
                type: "success",
                title: "Avatar approved",
                message: "Your avatar meets the required format, resolution and file size."
            });
        };

        image.onerror = () => {

            URL.revokeObjectURL(imageUrl);

            setAvatarValidation({
                type: "error",
                title: "Avatar rejected",
                message: "The selected file could not be read as a valid image."
            });
        };

        image.src = imageUrl;
    }

    function handleRemoveAvatar() {
        setAvatarPreview(null);
        setAvatarFile(null);
        setAvatarRemoved(true);
        setAvatarValidation(null);
    }

    function handleBannerChange(event) {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const maxSize = 10 * 1024 * 1024;
        const minimumWidth = 1200;
        const minimumHeight = 400;

        if (!allowedTypes.includes(file.type)) {
            setBannerValidation({
                type: "error",
                title: "Banner rejected",
                message: "Unsupported image format. Allowed formats: JPG, JPEG, PNG and WebP."
            });

            return;
        }

        if (file.size > maxSize) {
            setBannerValidation({
                type: "error",
                title: "Banner rejected",
                message: "The image is too large. Maximum allowed size is 10 MB."
            });

            return;
        }

        const imageUrl = URL.createObjectURL(file);
        const image = new Image();

        image.onload = () => {

            if (
                image.width < minimumWidth ||
                image.height < minimumHeight
            ) {
                URL.revokeObjectURL(imageUrl);

                setBannerValidation({
                    type: "error",
                    title: "Banner rejected",
                    message: `The image resolution is too low. Minimum required: ${minimumWidth} × ${minimumHeight} px.`
                });

                return;
            }

            setBannerPreview(imageUrl);
            setBannerFile(file);
            setBannerRemoved(false);

            setBannerValidation({
                type: "success",
                title: "Banner approved",
                message: "Your banner meets the required format, resolution and file size."
            });
        };

        image.onerror = () => {

            URL.revokeObjectURL(imageUrl);

            setBannerValidation({
                type: "error",
                title: "Banner rejected",
                message: "The selected file could not be read as a valid image."
            });
        };

        image.src = imageUrl;
    }

    function handleRemoveBanner() {
        setBannerPreview(null);
        setBannerFile(null);
        setBannerRemoved(true);
        setBannerValidation(null);
    }

    function handleCancel() {
        navigate("/profile");
    }

    async function handleSaveChanges() {
        try {
            const formData = new FormData();

            formData.append("firstName", profile.firstName);
            formData.append("lastName", profile.lastName);
            formData.append("bio", profile.bio);

            if (avatarFile) {
                formData.append("avatar", avatarFile);
            }

            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            formData.append("removeAvatar", avatarRemoved);
            formData.append("removeBanner", bannerRemoved);

            await updateProfile(formData);

            showToast({
                type: "Success",
                title: "PROFILE UPDATED",
                message: "Your profile is now up to date."
            });

            setTimeout(() => {
                navigate("/profile");
            }, 1800);

        } catch (error) {
            console.error("Error saving profile:", error);

            showToast({
                type: "Error",
                title: "PROFILE UPDATE FAILED",
                message: "Please try again."
            });
        }
    }

    if (loading) {
        return (
            <div className="edit-profile-page">
                <div className="edit-profile-container">
                    <p className="edit-profile-loading">
                        Loading profile...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-profile-page">

            <div className="edit-profile-container">

                <div className="edit-profile-avatar-section">

                    <div className="edit-profile-avatar-change">

                        <label
                            htmlFor="avatar-upload"
                            className="edit-profile-avatar-label"
                        >
                            Change Avatar
                        </label>

                        <label
                            htmlFor="avatar-upload"
                            className="edit-profile-avatar"
                        >
                            <img
                                src={avatarPreview || defaultAvatar}
                                alt="Profile"
                                onError={(e) => {
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.src = defaultAvatar;
                                }}
                            />

                            <span className="edit-profile-avatar-overlay">
                                <span className="edit-profile-camera">
                                    <svg viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M8 6l1.5-2h5L16 6h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h2z"/>
                                        <circle cx="12" cy="13" r="3.5"/>
                                    </svg>
                                </span>
                            </span>
                        </label>

                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleAvatarChange}
                            hidden
                        />

                        {(originalAvatarUrl || avatarFile) && !avatarRemoved && (
                            <button
                                type="button"
                                className="edit-profile-remove-button"
                                onClick={handleRemoveAvatar}
                            >
                                Delete Avatar
                            </button>
                        )}

                    </div>

                    <DirectorNote
                        title={avatarValidation?.title}
                        message={avatarValidation?.message}
                        type={avatarValidation?.type}
                    />

                </div>

                <div className="edit-profile-header">
                    <h1>Edit Profile</h1>
                    <p>
                        Update the information displayed on your profile.
                    </p>
                </div>

                <div className="edit-profile-section">

                    <h2>Personal Details</h2>

                    <div className="edit-profile-fields">

                        <div className="edit-profile-field">
                            <label htmlFor="firstName">
                                First Name
                            </label>

                            <input
                                id="firstName"
                                name="firstName"
                                type="text"
                                value={profile.firstName}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                        <div className="edit-profile-field">
                            <label htmlFor="lastName">
                                Last Name
                            </label>

                            <input
                                id="lastName"
                                name="lastName"
                                type="text"
                                value={profile.lastName}
                                onChange={handleChange}
                                maxLength={100}
                            />
                        </div>

                    </div>

                    <div className="edit-profile-field">
                        <label htmlFor="bio">
                            Bio
                        </label>

                        <textarea
                            id="bio"
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            maxLength={500}
                            rows={5}
                            placeholder="Tell us something about yourself..."
                        />
                    </div>

                </div>

                <div className="edit-profile-section">

                    <div className="edit-profile-banner-header">
                        <h2>Banner</h2>

                        {(originalBannerUrl || bannerFile) && !bannerRemoved && (
                            <button
                                type="button"
                                className="edit-profile-remove-button"
                                onClick={handleRemoveBanner}
                            >
                                Delete Banner
                            </button>
                        )}
                    </div>

                    <div className="edit-profile-banner-section">

                        <label
                            htmlFor="banner-upload"
                            className="edit-profile-banner"
                        >
                            {bannerPreview ? (
                                <img
                                    src={bannerPreview}
                                    alt="Banner preview"
                                    className="edit-profile-banner-image"
                                />
                            ) : (
                                <div className="edit-profile-banner-empty">
                                    <span className="edit-profile-banner-camera">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8 6l1.5-2h5L16 6h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h2z" />
                                            <circle cx="12" cy="13" r="3.5" />
                                        </svg>
                                    </span>

                                    <span className="edit-profile-banner-text">
                                        Change Banner
                                    </span>
                                </div>
                            )}

                            {bannerPreview && (
                                <span className="edit-profile-banner-overlay">
                                    <span className="edit-profile-banner-camera">
                                        <svg viewBox="0 0 24 24" aria-hidden="true">
                                            <path d="M8 6l1.5-2h5L16 6h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h2z" />
                                            <circle cx="12" cy="13" r="3.5" />
                                        </svg>
                                    </span>
                                 </span>
                            )}
                        </label>

                        <input
                            id="banner-upload"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            onChange={handleBannerChange}
                            hidden
                        />

                        <DirectorNote
                            title={bannerValidation?.title}
                            message={bannerValidation?.message}
                            type={bannerValidation?.type}
                        />

                    </div>

                </div>

                <div className="edit-profile-actions">

                    <button
                        type="button"
                        className="edit-profile-cancel"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="edit-profile-save"
                        onClick={handleSaveChanges}
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
}

export default EditProfilePage;