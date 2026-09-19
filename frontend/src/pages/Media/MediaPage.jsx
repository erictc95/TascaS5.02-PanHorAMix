import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SceneMenu from "../../components/common/SceneMenu/SceneMenu";
import phamBackIcon from "../../assets/icons/pham-back-icon.png";
import phamModePlaceholder from "../../assets/placeholders/pham-mode-placeholder.png"


import mediaService from "../../api/mediaService";
import { getProfile } from "../../api/userService";
import { useToast } from "../../context/ToastContext";

import "./MediaPage.css";

function MediaPage() {

    const { id } = useParams();

    const [searchParams] = useSearchParams();

    const fromProfile = searchParams.get("from") === "profile";

    const [media, setMedia] = useState(null);

    const [isOwner, setIsOwner] = useState(false);

    const [loading, setLoading] = useState(true);

    const [mediaList, setMediaList] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(-1);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showPhamControls, setShowPhamControls] = useState(false);

    const [touchStartY, setTouchStartY] = useState(null);

    const videoRef = useRef(null);

    const [isPhamMode, setIsPhamMode] = useState(!fromProfile);

    const [showPhamIntro, setShowPhamIntro] = useState(true);

    useEffect(() => {
        if (!showPhamIntro) return;

        const timer = setTimeout(() => {
            setShowPhamIntro(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [showPhamIntro]);

    const [editForm, setEditForm] = useState({
        title: "",
        description: "",
        category: ""
    });

    const [isEditing, setIsEditing] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [isDeleting, setIsDeleting] = useState(false);

    const { showToast } = useToast();

    const navigate = useNavigate();

    useEffect(() => {
        loadMedia();
    }, [id]);

    useEffect(() => {
        if (!isPhamMode || showPhamIntro || !media) return;
        if (media.mediaType !== "IMAGE") return;

        const timer = setTimeout(() => {
            goToNextMedia();
        }, 10000);

        return () => clearTimeout(timer);
    }, [id, media, isPhamMode, showPhamIntro, currentIndex]);

    async function loadMedia() {
        try {
            const response = await mediaService.getMediaById(id);
            setMedia(response);

            const allMediaResponse = await mediaService.getMedia();
            const allMedia = allMediaResponse.content || [];

            setMediaList(allMedia);

            const index = allMedia.findIndex(item => String(item.id) === String(id));
            setCurrentIndex(index);

            const profile = await getProfile();
            setIsOwner(profile.username === response.username);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    if (!media) {

        return <h2>Scene not found</h2>;

    }

    function goToNextMedia() {
        if (mediaList.length === 0 || currentIndex === -1) return;

        const nextIndex = (currentIndex + 1) % mediaList.length;
        const nextMedia = mediaList[nextIndex];

        navigate(`/media/${nextMedia.id}`);
    }

    function goToPreviousMedia() {
        if (mediaList.length === 0 || currentIndex === -1) return;

        const previousIndex =
            (currentIndex - 1 + mediaList.length) % mediaList.length;

        const previousMedia = mediaList[previousIndex];

        navigate(`/media/${previousMedia.id}`);
    }

    function handleTouchStart(e) {
        if (!isPhamMode || showPhamIntro) return;

        setTouchStartY({
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        });
    }

    function handleTouchEnd(e) {
        if (!isPhamMode || showPhamIntro || touchStartY === null) return;

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchStartY.x - touchEndX;
        const deltaY = touchStartY.y - touchEndY;

        const swipeThreshold = 80;

        // Ignorar movimientos principalmente verticales
        if (Math.abs(deltaX) < Math.abs(deltaY)) {
            setTouchStartY(null);
            return;
        }

        if (Math.abs(deltaX) < swipeThreshold) {
            setTouchStartY(null);
            return;
        }

        if (deltaX > 0) {
            // Swipe izquierda → siguiente media
            goToNextMedia();
        } else {
            // Swipe derecha → media anterior
            goToPreviousMedia();
        }

        setTouchStartY(null);
    }

    function exitPhamMode() {
        document.querySelectorAll("video, audio").forEach((media) => {
            media.pause();
            media.currentTime = 0;
        });

        navigate("/home");
    }

    function handleVisibilityChange(updatedMedia) {
        setMedia(updatedMedia);

        if (updatedMedia.visibility === "PUBLIC") {
            showToast({
                type: "Success",
                title: "SCENE PUBLIC",
                message: "Your scene is now visible to everyone."
            });
        } else {
            showToast({
                type: "Success",
                title: "SCENE PRIVATE",
                message: "Your scene is now private."
            });
        }
    }

    function openEditModal() {
        setEditForm({
            title: media.title || "",
            description: media.description || "",
            category: media.category || ""
        });

        setShowEditModal(true);
    }

    function closeEditModal() {
        setShowEditModal(false);
    }

    function handleEditChange(e) {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    function openDeleteModal() {
        setShowDeleteModal(true);
    }

    function closeDeleteModal() {
        setShowDeleteModal(false);
    }

    async function handleEdit() {
        if (isEditing) return;

        setIsEditing(true);

        try {
            const updatedMedia = await mediaService.updateMedia(id, {
                title: editForm.title,
                description: editForm.description,
                category: editForm.category,
                visibility: media.visibility
            });

            setMedia(updatedMedia);
            setShowEditModal(false);

            showToast({
                type: "Success",
                title: "SCENE UPDATED",
                message: "Your scene has been updated."
            });

        } catch (error) {
            console.error("Error updating scene:", error);

            showToast({
                type: "Error",
                title: "SCENE UPDATE FAILED",
                message: "Please try again."
            });

        } finally {
            setIsEditing(false);
        }
    }

    async function handleDelete() {

        if (isDeleting) return;

        setIsDeleting(true);

        try {

            await mediaService.deleteMedia(id);

            showToast({
                type: "Success",
                title: "SCENE REMOVED",
                message: "Your scene has been permanently removed."
            });

            setShowDeleteModal(false);

            setTimeout(() => {
                navigate("/profile");
            }, 1800);

        } catch (error) {

            console.error(error);

            showToast({
                type: "Error",
                title: "SCENE REMOVAL FAILED",
                message: "Please try again."
            });

            setIsDeleting(false);
        }
    }

    return (

        <div className={`media-page ${isPhamMode ? "pham-mode" : ""}`}>

            {isPhamMode && showPhamIntro && (
                <div className="pham-mode-intro">
                    <img
                        src={phamModePlaceholder}
                        alt="PHAM MODE"
                    />
                </div>
            )}

            {isPhamMode && !showPhamIntro && (
                <button
                    className="pham-mode-exit"
                    onClick={exitPhamMode}
                >
                    EXIT PHAM MODE
                </button>
            )}

            <div
                className="scene-container"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >

                <div className="media-toolbar">

                    <button
                        className="back-button"
                        onClick={() => navigate(-1)}
                    >
                        <img
                            src={phamBackIcon}
                            alt="Back"
                        />
                    </button>

                    {isOwner && (
                        <SceneMenu
                            item={media}
                            onDelete={openDeleteModal}
                            onVisibilityChange={handleVisibilityChange}
                            onEdit={openEditModal}
                        />
                    )}

                </div>

                <div className="media-player">

                    {media.mediaType === "IMAGE" ? (

                        <img
                            src={media.mediaUrl}
                            alt={media.title}
                        />

                    ) : (

                        <video
                            ref={videoRef}
                            controls
                            autoPlay
                            muted
                            playsInline
                            onEnded={goToNextMedia}
                        >
                            <source src={media.mediaUrl} />
                        </video>

                    )}

                </div>

                <div className="media-info">

                    <h1>{media.title}</h1>

                    <p>{media.description}</p>

                </div>

            </div>

            {showEditModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal edit-modal">

                        <h2>EDIT THIS SCENE</h2>

                        <div className="edit-form">

                            <label>
                                TITLE
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={editForm.title}
                                onChange={handleEditChange}
                            />

                            <label>
                                DESCRIPTION
                            </label>

                            <textarea
                                name="description"
                                value={editForm.description}
                                onChange={handleEditChange}
                                rows="4"
                            />

                            <label>
                                CATEGORY
                            </label>

                            <select
                                name="category"
                                value={editForm.category}
                                onChange={handleEditChange}
                            >
                                <option value="">Select a category</option>

                                <option value="Cinema">Cinema</option>
                                <option value="Photography">Photography</option>
                                <option value="Nature">Nature</option>
                                <option value="Travel">Travel</option>
                                <option value="Automotive">Automotive</option>
                                <option value="Architecture">Architecture</option>
                                <option value="Urban">Urban</option>
                                <option value="People">People</option>
                                <option value="Wildlife">Wildlife</option>
                                <option value="Sports">Sports</option>
                                <option value="Lifestyle">Lifestyle</option>
                                <option value="Events">Events</option>
                                <option value="Food">Food</option>
                                <option value="Fashion">Fashion</option>
                                <option value="Technology">Technology</option>
                                <option value="Abstract">Abstract</option>
                            </select>

                        </div>

                        <div className="delete-modal-actions">

                            <button
                                className="delete-modal-cancel"
                                onClick={closeEditModal}
                                disabled={isEditing}
                            >
                                CANCEL
                            </button>

                            <button
                                className="delete-modal-confirm"
                                onClick={handleEdit}
                                disabled={isEditing}
                            >
                                {isEditing ? "SAVING..." : "SAVE CHANGES"}
                            </button>

                        </div>

                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="delete-modal-overlay">
                    <div className="delete-modal">

                        {!isDeleting ? (
                            <>
                                <h2>READY TO CUT THIS SCENE?</h2>

                                <p>
                                    This scene will be permanently removed.
                                </p>

                                <small>
                                    This action cannot be undone.
                                </small>

                                <div className="delete-modal-actions">

                                    <button
                                        className="delete-modal-cancel"
                                        onClick={closeDeleteModal}
                                    >
                                        CANCEL
                                    </button>

                                    <button
                                        className="delete-modal-confirm"
                                        onClick={handleDelete}
                                    >
                                        CUT SCENE
                                    </button>

                                </div>
                            </>
                        ) : (
                            <>
                                <h2>CUTTING SCENE...</h2>

                                <p>
                                    Removing your scene.
                                </p>

                                <div className="delete-loader"></div>
                            </>
                        )}

                    </div>
                </div>
            )}

        </div>

    );

}

export default MediaPage;