import { useEffect, useState } from "react";

import mediaService from "../../../api/mediaService.js";

import EmptyState from "./EmptyState";
import VideoFeedSkeleton from "./VideoFeedSkeleton.jsx";
import MediaCard from "../../../components/scene/MediaCard";
import "./VideoFeed.css";

function VideoFeed({ selectedCategories }) {

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

    const filteredMedia =
        selectedCategories.length === 0
            ? media
            : media.filter(item =>
                selectedCategories.includes(item.category)
            );

    return (

        <div className="video-feed">

            {filteredMedia.map(item => (

                <MediaCard
                    key={item.id}
                    item={item}
                    showVisibility={false}
                />

            ))}

        </div>

    );

}

export default VideoFeed;