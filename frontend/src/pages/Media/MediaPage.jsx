import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FrameButton from "../../components/common/FrameButton";
import SceneMenu from "../../components/common/SceneMenu/SceneMenu";

import mediaService from "../../api/mediaService";
import { getProfile } from "../../api/userService";

import "./MediaPage.css";

function MediaPage() {

    const { id } = useParams();

    const [media, setMedia] = useState(null);

    const [isOwner, setIsOwner] = useState(false);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        loadMedia();

    }, [id]);

    async function loadMedia() {

        try {

            const response = await mediaService.getMediaById(id);

            setMedia(response);

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

    async function handleDelete() {

        const confirmed = window.confirm(
            "Are you sure you want to delete this scene?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await mediaService.deleteMedia(id);

            navigate("/profile");

        } catch (error) {

            console.error(error);

            alert("Failed to delete the scene.");

        }

    }

    return (

        <div className="media-page">

            <div className="scene-container">

                <div className="media-toolbar">

                    <FrameButton
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </FrameButton>

                    {isOwner && (
                        <SceneMenu item={media} />
                    )}

                </div>

                <div className="media-player">

                    {media.mediaType === "IMAGE" ? (

                        <img
                            src={media.mediaUrl}
                            alt={media.title}
                        />

                    ) : (

                        <video controls>

                            <source src={media.mediaUrl} />

                        </video>

                    )}

                </div>

                <div className="media-info">

                    <h1>{media.title}</h1>

                    <p>{media.description}</p>

                </div>

            </div>

        </div>

    );

}

export default MediaPage;