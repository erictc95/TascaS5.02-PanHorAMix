import "./Navbar.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getProfile } from "../../../api/userService";

function Navbar() {

    const navigate = useNavigate();

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

    function logout() {

        sessionStorage.clear();

        navigate("/");

    }

    return (

        <header className="pham-navbar">

            <Link
                to="/home"
                className="pham-logo"
            >
                PHAM
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
                            @{user.username}
                        </span>

                        <button
                            onClick={logout}
                            className="pham-logout"
                        >
                            Logout
                        </button>

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