import { useNavigate } from "react-router-dom";
import PHButton from "../../../components/common/PHButton";

function UploadButton() {

    const navigate = useNavigate();

    function handleUpload() {
        navigate("/upload");
    }

    return (
        <PHButton onClick={handleUpload}>
            🎥 Upload your First Take
        </PHButton>
    );

}

export default UploadButton;