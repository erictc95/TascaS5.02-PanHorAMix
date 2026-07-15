import {useRef, useState} from "react";
import PHButton from "../../../components/common/PHButton";
import DirectorNote from "./DirectorNote";
import MediaDetailsForm from "./MediaDetailsForm";

function MediaSelector() {

    const inputFileRef = useRef(null);

    const [selectedMedia, setSelectedMedia] = useState(null);

    const [mediaType, setMediaType] = useState("");

    const [previewUrl, setPreviewUrl] = useState("");

    const [directorTitle, setDirectorTitle] = useState("");

    const [directorMessage, setDirectorMessage] = useState("");

    const [directorType, setDirectorType] = useState("");

    function acceptScene(file) {

        setSelectedMedia(file);

        setPreviewUrl(URL.createObjectURL(file));

        setDirectorType("success");

        setDirectorTitle("Scene Approved");

        setDirectorMessage(
            "Reason\n\n" +
            "Excellent framing.\n" +
            "Your scene meets all PHAM requirements.\n\n" +
            "Next Step\n\n" +
            "Complete the remaining information and publish your scene.\n\n" +
            "Why?\n\n" +
            "Your audience is waiting."
        );

    }

    function rejectScene(message) {

        setSelectedMedia(null);

        setPreviewUrl("");

        setDirectorType("error");

        setDirectorTitle("Scene Rejected");

        setDirectorMessage(message);

    }

    function validateFormat(file) {

        const allowedTypes = [
            "video/mp4",
            "video/quicktime",
            "image/jpeg",
            "image/png"
        ];

        if (!allowedTypes.includes(file.type)) {

            rejectScene(
                "Reason\n\n" +
                "This media format isn't supported.\n\n" +
                "How to fix it\n\n" +
                "Choose a scene in one of the supported formats:\n" +
                "• MP4\n" +
                "• MOV\n" +
                "• JPG\n" +
                "• PNG\n\n" +
                "Why?\n\n" +
                "Supported formats ensure the best playback experience for everyone."
            );

            return false;

        }

        return true;

    }

    function handleChooseScene() {

        inputFileRef.current.click();

    }

    function handleMediaSelected(event) {

        const file = event.target.files[0];

        if (!file) {

            return;

        }

        if (file.type.startsWith("video/")) {

            setMediaType("Video");

        } else if (file.type.startsWith("image/")) {

            setMediaType("Image");

        }

        if (!validateFormat(file)) {

            return;

        }

        validateOrientation(file);
    }


    function validateOrientation(file) {

        const url = URL.createObjectURL(file);

        if (file.type.startsWith("image/")) {

            const image = new Image();

            image.onload = () => {

                if (image.width < image.height) {

                    rejectScene(
                        "Reason\n\n" +
                        "This scene is in portrait orientation.\n\n" +
                        "How to fix it\n\n" +
                        "Rotate your camera before taking the picture,\n" +
                        "or export the image in landscape.\n\n" +
                        "Why?\n\n" +
                        "Cinema deserves landscape."
                    );

                    URL.revokeObjectURL(url);

                    return;

                }

                acceptScene(file);

                URL.revokeObjectURL(url);

            };

            image.src = url;

        } else {

            const video = document.createElement("video");

            video.preload = "metadata";

            video.onloadedmetadata = () => {

                if (video.videoWidth < video.videoHeight) {

                    rejectScene(
                        "Reason\n\n" +
                        "This scene is in portrait orientation.\n\n" +
                        "How to fix it\n\n" +
                        "Record or export your scene in landscape.\n\n" +
                        "Why?\n\n" +
                        "Cinema deserves landscape."
                    );

                    URL.revokeObjectURL(url);

                    return;

                }

                acceptScene(file);

                URL.revokeObjectURL(url);

            };

            video.src = url;

        }

    }

    return (

        <div className="media-selector">

            <div className="upload-zone">

                <h2>🎥</h2>

                <h3>Drag & Drop your First Take</h3>

                <p>or</p>

                <PHButton onClick={handleChooseScene}>

                    Choose Scene

                </PHButton>

                <input
                    type="file"
                    accept="video/*,image/*"
                    ref={inputFileRef}
                    onChange={handleMediaSelected}
                    hidden
                />

                <MediaDetailsForm
                    media={selectedMedia}
                    mediaType={mediaType}
                />

                {previewUrl && (

                    <div className="media-preview">

                        {mediaType === "Image" ? (

                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="preview-image"
                            />

                        ) : (

                            <video
                                controls
                                className="preview-video"
                            >
                                <source src={previewUrl}/>
                            </video>

                        )}

                    </div>

                )}

                {directorMessage && (

                    <DirectorNote
                        type={directorType}
                        title={directorTitle}
                        message={directorMessage}
                    />

                )}

            </div>

        </div>

    );

}

export default MediaSelector;