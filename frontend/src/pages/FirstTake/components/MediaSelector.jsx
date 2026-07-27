import {useRef, useState} from "react";
import PHButton from "../../../components/common/PHButton";
import DirectorNote from "./DirectorNote";
import MediaDetailsForm from "./MediaDetailsForm";
import PublishButton from "./PublishButton.jsx";
import SceneInformationForm from "./SceneInformationForm";

function MediaSelector() {

    const inputFileRef = useRef(null);

    const [selectedMedia, setSelectedMedia] = useState(null);

    const [mediaType, setMediaType] = useState("");

    const [previewUrl, setPreviewUrl] = useState("");

    const [sceneData, setSceneData] = useState({

        title: "",
        description: "",
        category: "",
        visibility: ""

    });

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

            resetMediaInput();

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

        resetMediaInput();
    }

    function resetMediaInput() {

        if (inputFileRef.current) {

            inputFileRef.current.value = "";

        }

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

                if (!validateResolution(file, image.width, image.height)) {

                    URL.revokeObjectURL(url);

                    return;

                }

                if (!validateFileSize(file)) {

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

                if (!validateResolution(file, video.videoWidth, video.videoHeight)) {

                    URL.revokeObjectURL(url);

                    return;

                }

                if (!validateFileSize(file)) {

                    URL.revokeObjectURL(url);

                    return;

                }

                acceptScene(file);

                URL.revokeObjectURL(url);

                acceptScene(file);

                URL.revokeObjectURL(url);

            };

            video.src = url;

        }

    }

    function validateResolution(file, width, height) {

        const minimumWidth = 1920;

        const minimumHeight = 1080;

        if (width < minimumWidth || height < minimumHeight) {

            rejectScene(
                "Reason\n\n" +

                "This scene doesn't meet PHAM's minimum resolution.\n\n" +

                "Detected\n\n" +

                `${width} × ${height}\n\n` +

                "Required\n\n" +

                "1920 × 1080\n\n" +

                "How to fix it\n\n" +

                "Export your scene in Full HD or higher.\n\n" +

                "Why?\n\n" +

                "Every scene deserves a cinematic presentation."
            );

            return false;

        }

        return true;

    }

    function validateFileSize(file) {

        const maximumSize = 700 * 1024 * 1024;

        if (file.size > maximumSize) {

            rejectScene(

                "Reason\n\n" +

                "This scene exceeds the maximum file size.\n\n" +

                "Detected\n\n" +

                `${(file.size / 1024 / 1024).toFixed(2)} MB\n\n` +

                "Maximum\n\n" +

                "700 MB\n\n" +

                "How to fix it\n\n" +

                "Compress or export your scene with a lower bitrate.\n\n" +

                "Why?\n\n" +

                "Fast uploads create a better experience for everyone."

            );

            return false;

        }

        return true;

    }

    return (

        <div className="media-selector">

            <div className="upload-zone">

                <div className={"upload-content"}>

                    <h2>🖼️🎥</h2>

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

                </div>

                <MediaDetailsForm
                    media={selectedMedia}
                    mediaType={mediaType}
                />

                {selectedMedia && (

                    <SceneInformationForm
                        sceneData={sceneData}
                        setSceneData={setSceneData}
                    />

                )}

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

                {directorType === "success" && (

                    <div className="publish-container">

                        <PublishButton
                            selectedMedia={selectedMedia}
                            mediaType={mediaType}
                            sceneData={sceneData}
                        />

                    </div>

                )}

            </div>

        </div>

    );

}

export default MediaSelector;