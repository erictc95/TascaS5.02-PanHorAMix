import "./ProfilePage.css";

import { useEffect, useState } from "react";

import { getProfile } from "../../api/userService";
import mediaService from "../../api/mediaService";
import SceneStatus from "../../components/scene/SceneStatus.jsx";
import {useNavigate} from "react-router-dom";

function ProfilePage() {

    const [user, setUser] = useState(null);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {

        loadProfile();
        loadMyMedia();

    }, []);

    async function loadProfile() {

        try {

            const profile = await getProfile();

            setUser(profile);

        } catch (error) {

            console.error(error);

        }

    }

    async function loadMyMedia() {

        try {

            const response = await mediaService.getMyMedia();

            setMedia(response.content);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="profile-page">

            <div className="profile-header">

                <div className="profile-avatar">

                    👤

                </div>

                <h1>

                    @{user?.username}

                </h1>

                <p>

                    {media.length} Scene{media.length !== 1 ? "s" : ""}

                </p>

            </div>

            <div className="profile-content">

                <h2>

                    Your Scenes

                </h2>

                {loading ? (

                    <p>

                        Loading...

                    </p>

                ) : media.length === 0 ? (

                    <p>

                        No scenes published yet.

                    </p>

                ) : (

                    <div className="profile-grid">

                        {media.map(scene => (

                            <div
                                key={scene.id}
                                className="profile-card"
                                onClick={() => navigate(`/media/${scene.id}`)}
                            >

                                <div className="profile-card-status">

                                    <SceneStatus visibility={scene.visibility} />

                                </div>

                                <img
                                    src={scene.thumbnailUrl || scene.mediaUrl}
                                    alt={scene.title}
                                />

                                <h3>

                                    {scene.title}

                                </h3>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>

    );

}

export default ProfilePage;

