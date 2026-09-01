import { useEffect, useState } from "react";
import { getProfile } from "../../api/userService";

import PhamFrame from "./components/PhamFrame.jsx";
import VideoFeed from "./components/VideoFeed";
import phamFilterIcon from "../../assets/icons/pham-filter-icon.png";

import "./HomePage.css";

function HomePage() {

    const [user, setUser] = useState(null);

    const [filterOpen, setFilterOpen] = useState(false);

    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = [
        "Cinema",
        "Photography",
        "Nature",
        "Travel",
        "Automotive",
        "Architecture",
        "Urban",
        "People",
        "Wildlife",
        "Sports",
        "Lifestyle",
        "Events",
        "Food",
        "Fashion",
        "Technology",
        "Abstract"
    ];

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }, [selectedCategories]);

    function toggleCategory(category) {
        setSelectedCategories(previous =>
            previous.includes(category)
                ? previous.filter(item => item !== category)
                : [...previous, category]
        );
    }

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

                <div className="feed-filter-container">

                    <button
                        className="feed-filter-button"
                        onClick={() => setFilterOpen(previous => !previous)}
                    >
                        <img
                            src={phamFilterIcon}
                            alt="Filter"
                        />
                    </button>

                    {filterOpen && (
                        <div className="filter-menu">

                            {categories.map(category => (
                                <label
                                    key={category}
                                    className={`filter-option ${
                                        selectedCategories.includes(category) ? "selected" : ""
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => toggleCategory(category)}
                                    />

                                    <span>{category}</span>
                                </label>
                            ))}

                        </div>
                    )}

                </div>

                <VideoFeed selectedCategories={selectedCategories} />

            </div>
    );
}

export default HomePage;