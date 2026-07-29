import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import FrameButton from "../../components/common/FrameButton";

import mediaService from "../../api/mediaService";

import "./MediaPage.css";

function MediaPage() {

    const { id } = useParams();

    const [media, setMedia] = useState(null);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        loadMedia();

    }, [id]);

    async function loadMedia() {

        try {

            const response = await mediaService.getMediaById(id);

            setMedia(response);

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

    return (

        <div className="media-page">

            <FrameButton
                onClick={() => navigate(-1)}
            >
                ← Back
            </FrameButton>

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

    );

}

export default MediaPage;