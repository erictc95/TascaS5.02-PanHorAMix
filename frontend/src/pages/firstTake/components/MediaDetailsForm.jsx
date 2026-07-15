function MediaDetailsForm({ media, mediaType }) {

    if (!media) {

        return null;

    }

    return (

        <div className="selected-media">

            <h3>🎬 Scene Approved</h3>

            <p>
                <strong>Media:</strong> {mediaType}
            </p>

            <p>
                <strong>Name:</strong> {media.name}
            </p>

            <p>
                <strong>Type:</strong> {media.type}
            </p>

            <p>
                <strong>Size:</strong> {(media.size / 1024 / 1024).toFixed(2)} MB
            </p>

        </div>

    );

}

export default MediaDetailsForm;