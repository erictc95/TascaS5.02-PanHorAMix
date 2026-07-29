import { useEffect, useState } from "react";

import mediaService from "../../../api/mediaService.js";

import SceneStatus from "../../../components/scene/SceneStatus";
import EmptyState from "./EmptyState";
import VideoFeedSkeleton from "./VideoFeedSkeleton.jsx";
import MediaCard from "../../../components/scene/MediaCard";
import "./VideoFeed.css";

function VideoFeed() {

    const [media, setMedia] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadMedia();

    }, []);

    async function loadMedia() {

        try {

            const response = await mediaService.getMedia();

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

            {media.map(item => (

                <MediaCard
                    key={item.id}
                    item={item}
                />

            ))}

        </div>

    );

}

export default VideoFeed;