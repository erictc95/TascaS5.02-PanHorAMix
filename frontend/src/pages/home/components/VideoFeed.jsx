import { useEffect, useState } from "react";

import videoService from "../../../api/videoService";

import EmptyState from "./EmptyState";
import VideoFeedSkeleton from "./VideoFeedSkeleton.jsx";

function VideoFeed() {

    const [media, setMedia] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadMedia();

    }, []);

    async function loadMedia() {

        try {

            const response = await videoService.getMedia();

            setMedia(response.content);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <VideoFeedSkeleton />;

    }

    if (media.length === 0) {

        return <EmptyState />;

    }

    return (

        <div className="video-feed">

            {media.map((item) => (

                <div
                    key={item.id}
                    className="media-card"
                >

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                    {item.mediaType === "IMAGE" ? (

                        <img
                            src={item.mediaUrl}
                            alt={item.title}
                            width="600"
                        />

                    ) : (

                        <video
                            controls
                            width="600"
                        >

                            <source src={item.mediaUrl} />

                        </video>

                    )}

                </div>

            ))}

        </div>

    );

}

export default VideoFeed;