import "./FirstTakePage.css";

import VideoSelector from "./components/VideoSelector.jsx";
import VideoDetailsForm from "./components/VideoDetailsForm.jsx";
import PublishButton from "./components/PublishButton.jsx";

function FirstTakePage() {

    return (

        <div className="first-take-page">

            <h1>🎥 FIRST TAKE</h1>

            <p>Every great story starts here.</p>

            <VideoSelector />

            <VideoDetailsForm />

            <PublishButton />

        </div>

    );

}

export default FirstTakePage;