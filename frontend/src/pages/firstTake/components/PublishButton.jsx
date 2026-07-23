import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PHButton from "../../../components/common/PHButton";
import videoService from "../../../api/videoService";
import { useToast } from "../../../context/ToastContext";

function PublishButton({
                           selectedMedia,
                           mediaType,
                           sceneData
                       }) {

    const navigate = useNavigate();

    const { showToast } = useToast();

    const [publishing, setPublishing] = useState(false);

    async function handlePublish() {

        if (publishing) return;

        setPublishing(true);

        try {

            const formData = new FormData();

            formData.append("file", selectedMedia);

            formData.append("title", sceneData.title);

            formData.append("description", sceneData.description);

            formData.append("category", sceneData.category);

            formData.append("visibility", sceneData.visibility);

            formData.append("mediaType", mediaType.toUpperCase());

            const media = await videoService.createMedia(formData);

            console.log(media);

            showToast({

                type: "Success",

                title: "MEDIA PUBLISHED",

                message: "Your scene is now live."

            });

            setTimeout(() => {
                navigate("/home");
            }, 1800);

        } catch (error) {

            console.error(error);

            showToast({

                type: "Error",

                title: "MEDIA UPLOAD FAILED",

                message: "Please try again."

            });

        } finally {

            setPublishing(false);

        }

    }

    return (

        <PHButton
            onClick={handlePublish}
            disabled={publishing}
        >

            {publishing ? (
                <>
                    <span className="ph-button-spinner"></span>
                    Uploading Media...
                </>
            ) : (
                <>🎬 Publish</>
            )}

        </PHButton>

    );

}

export default PublishButton;