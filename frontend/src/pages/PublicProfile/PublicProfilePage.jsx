import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicProfile } from "../../api/userService";
import ProfileGrid from "../../components/profile/ProfileGrid";
import ProfileHeader from "../../components/profile/ProfileHeader";
import "./PublicProfilePage.css";
import {
    getPublicMediaByUserId,
    getAdminMediaByUserId
} from "../../api/mediaService";

function PublicProfilePage() {

    const { username } = useParams();

    const [user, setUser] = useState(null);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, [username]);

    async function loadProfile() {

        try {

            const profile = await getPublicProfile(username);

            setUser(profile);

            const role = sessionStorage.getItem("role");

            const mediaResponse = role === "ADMIN"
                ? await getAdminMediaByUserId(profile.id)
                : await getPublicMediaByUserId(profile.id);

            setMedia(mediaResponse.content);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!user) {
        return <p>User not found.</p>;
    }

    return (
        <div className="profile-page">

            <ProfileHeader
                username={user.username}
                sceneCount={media.length}
                avatarUrl={user.avatarUrl}
                bannerUrl={user.bannerUrl}
            />

            <ProfileGrid media={media} />

        </div>
    );
}

export default PublicProfilePage;