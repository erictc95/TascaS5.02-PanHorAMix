import "./Navbar.css";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProfile } from "../../../api/userService";

function Navbar() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadProfile() {

            const token = sessionStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const profile = await getProfile();

                setUser(profile);

            } catch (error) {

                console.error(error);

                sessionStorage.removeItem("token");

            } finally {

                setLoading(false);

            }

        }

        loadProfile();

    }, []);

    return (

        <header className="pham-navbar">

            <Link to="/home" className="pham-logo">

                <span className="pham-frame"></span>

                <div className="pham-logo-text">

        <span className="pham-title">
            PHAM
        </span>

                    <span className="pham-subtitle">
            Designed for Landscape Cinema
        </span>

                </div>

            </Link>

            <nav className="pham-navbar-links">

                {loading ? (

                    <span>...</span>

                ) : user ? (

                    <>

                        <Link to="/upload">
                            Upload
                        </Link>

                        <span className="pham-user">
                            <Link to="/profile">
                                @{user.username}
                            </Link>
                        </span>

                    </>

                ) : (

                    <>

                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>

                    </>

                )}

            </nav>

        </header>

    );

}

export default Navbar;