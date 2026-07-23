import "./VideoFeedSkeleton.css";

function VideoFeedSkeleton() {

    return (

        <div className="video-feed">

            {[1, 2, 3].map((item) => (

                <div
                    key={item}
                    className="media-card skeleton-card"
                >

                    <div className="skeleton skeleton-title"></div>

                    <div className="skeleton skeleton-text"></div>

                    <div className="skeleton skeleton-media"></div>

                </div>

            ))}

        </div>

    );

}

export default VideoFeedSkeleton;