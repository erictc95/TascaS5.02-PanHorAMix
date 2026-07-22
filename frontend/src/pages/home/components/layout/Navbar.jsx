import "./Navbar.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Navbar() {

    const navigate = useNavigate();

    const [logged, setLogged] = useState(false);

    const [username, setUsername] = useState("");

    useEffect(() => {

        const token = sessionStorage.getItem("token");

        const storedUsername = sessionStorage.getItem("username");

        setLogged(!!token);

        setUsername(storedUsername || "");

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

            <nav>

                {!logged ? (

                    <>

                        <Link to="/login">

                            Login

                        </Link>

                        <Link to="/register">

                            Register

                        </Link>

                    </>

                ) : (

                    <>

                        <Link to="/upload">

                            Upload

                        </Link>

                        <Link to="/home">

                            @{username}

                        </Link>

                        <button onClick={logout}>

                            Logout

                        </button>

                    </>

                )}

            </nav>

        </header>

    );

}

export default Navbar;