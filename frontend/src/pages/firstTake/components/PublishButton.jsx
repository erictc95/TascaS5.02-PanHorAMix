import PHButton from "../../../components/common/PHButton";
import videoService from "../../../api/videoService";

function PublishButton({
                           selectedMedia,
                           mediaType,
                           sceneData
                       }) {

    async function handlePublish() {

        try {

            const formData = new FormData();

            formData.append("file", selectedMedia);

            formData.append(
                "title",
                sceneData.title
            );

            formData.append(
                "description",
                sceneData.description
            );

            formData.append(
                "category",
                sceneData.category
            );

            formData.append(
                "visibility",
                sceneData.visibility
            );

            formData.append(
                "mediaType",
                mediaType.toUpperCase()
            );

            const media = await videoService.createMedia(formData);

            console.log(media);

            alert("Scene published successfully!");

        } catch (error) {

            console.error(error);

            alert("Error publishing the scene.");

        }

    }

    return (

        <PHButton onClick={handlePublish}>

            🎬 Publish

        </PHButton>

    );

}

export default PublishButton;