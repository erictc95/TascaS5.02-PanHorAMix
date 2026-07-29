import { useEffect, useState } from "react";
import { getProfile } from "../../api/userService";

import PhamFrame from "./components/PhamFrame.jsx";
import VideoFeed from "./components/VideoFeed";
import UploadButton from "./components/UploadButton";

import "./HomePage.css";

function HomePage() {

    const [user, setUser] = useState(null);

    useEffect(() => {
        async function loadProfile() {
            try {
                const profile = await getProfile();
                setUser(profile);
            } catch (error) {
                console.error(error);
            }
        }

        loadProfile();
    }, []);

    return (
            <div className="home-page">

                <PhamFrame username={user?.username} />

                <VideoFeed />

            </div>
    );
}

export default HomePage;