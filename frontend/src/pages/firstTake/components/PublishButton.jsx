import PHButton from "../../../components/common/PHButton";

function PublishButton() {

    function handlePublish() {

        console.log("Publish video");

    }

    return (

        <PHButton onClick={handlePublish}>

            🎬 Publish

        </PHButton>

    );

}

export default PublishButton;