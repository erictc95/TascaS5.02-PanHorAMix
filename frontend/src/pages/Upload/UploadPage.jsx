import { useEffect, useState } from "react";
import "./UploadPage.css";

import mediaService from "../../api/mediaService";
import MediaSelector from "./components/MediaSelector.jsx";
import firstTakeHero from "../../assets/brand/Panhoramix-first-take-hero.png";
import nextSceneHero from "../../assets/brand/Panhoramix-next-scene-hero.png";


function UploadPage() {

    const [isFirstTake, setIsFirstTake] = useState(null);

    useEffect(() => {

        async function checkFirstTake() {

            try {

                const response = await mediaService.getMyMedia();

                setIsFirstTake(response.totalElements === 0);

            } catch (error) {

                console.error("Failed to check user's scenes:", error);

            }

        }

        checkFirstTake();

    }, []);

    if (isFirstTake === null) {
        return null;
    }

    return (

        <div className="first-take-page">

            {isFirstTake && (
                <div className="first-take-hero">
                    <img
                        src={firstTakeHero}
                        alt="Panhoramix First Take"
                    />
                </div>
            )}

            {!isFirstTake && (
                <div className="next-scene-hero">
                    <img
                        src={nextSceneHero}
                        alt="Panhoramix Next Scene"
                    />
                </div>
            )}

            <MediaSelector isFirstTake={isFirstTake} />

        </div>

    );

}

export default UploadPage;