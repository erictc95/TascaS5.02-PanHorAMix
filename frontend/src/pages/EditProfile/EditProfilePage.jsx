import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {getProfile} from "../../api/userService";
import defaultAvatar from "../../assets/icons/default-avatar-icon.png";
import "./EditProfilePage.css";
import DirectorNote from "../Upload/components/DirectorNote";

function EditProfilePage() {

    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: "",
        lastName: "",
        bio: ""
    });

    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfile() {

            try {
                const data = await getProfile();

                setProfile({
                    firstName: data.firstName || "",
                    lastName: data.lastName || "",
                    bio: data.bio || ""
                });

                setAvatarPreview(data.avatarUrl || null);

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

    function handleAvatarChange(event) {

        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const imageUrl = URL.createObjectURL(file);

        setAvatarPreview(imageUrl);
    }

    function handleCancel() {
        navigate("/profile");
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
                                <svg
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                <path d="M8 6l1.5-2h5L16 6h2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V9a3 3 0 0 1 3-3h2z"/>
                                <circle cx="12" cy="13" r="3.5"/>
                                </svg>
                            </span>
                        </span>
                    </label>

                    <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        hidden
                    />

                    <span className="edit-profile-avatar-label">
                        Change Avatar
                    </span>

                    <DirectorNote
                        title="Your Profile, Your First Frame"
                        message="Your profile photo is the first frame people see. Choose an image that represents you."
                        type="info"
                    />

                </div>

                <div className="edit-profile-header">
                    <h1>Edit Profile</h1>
                    <p>
                        Update the information displayed on your profile.
                    </p>
                </div>

                <div className="edit-profile-section">

                    <h2>Profile Information</h2>

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

                    <h2>Profile Images</h2>

                    <div className="edit-profile-image-placeholder">
                        <p>
                            Profile Banner
                        </p>

                        <span>
                            Banner upload will be added here.
                        </span>
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
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
}

export default EditProfilePage;