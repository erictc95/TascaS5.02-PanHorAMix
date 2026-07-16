import "./FirstTakePage.css";

import MediaSelector from "./components/MediaSelector.jsx";
import MediaDetailsForm from "./components/MediaDetailsForm.jsx";


function FirstTakePage() {

    return (

        <div className="first-take-header">

            <h1> FIRST TAKE </h1>

            <MediaSelector />

            <MediaDetailsForm />

        </div>

    );

}

export default FirstTakePage;