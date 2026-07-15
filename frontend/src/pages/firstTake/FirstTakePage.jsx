import "./FirstTakePage.css";

import MediaSelector from "./components/MediaSelector.jsx";
import MediaDetailsForm from "./components/MediaDetailsForm.jsx";
import PublishButton from "./components/PublishButton.jsx";

function FirstTakePage() {

    return (

        <div className="first-take-page">

            <h1>🎥 FIRST TAKE</h1>

            <p>Every great story starts here.</p>

            <MediaSelector />

            <MediaDetailsForm />

            <PublishButton />

        </div>

    );

}

export default FirstTakePage;