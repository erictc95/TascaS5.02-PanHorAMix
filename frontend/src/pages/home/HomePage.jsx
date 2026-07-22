import { useEffect, useState } from "react";
import { getProfile } from "../../api/userService";

import FocusFrame from "./components/FocusFrame.jsx";
import VideoFeed from "./components/VideoFeed";
import AppLayout from "../../components/layout/AppLayout";
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
        <AppLayout>
            <div className="home-page">

                <FocusFrame username={user?.username} />

                <UploadButton />

                <VideoFeed />

            </div>
        </AppLayout>
    );
}

export default HomePage;