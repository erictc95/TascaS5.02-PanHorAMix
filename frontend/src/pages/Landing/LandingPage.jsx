import "./LandingPage.css";
import {Link} from "react-router-dom";
import PHButton from "../../components/common/PHButton";

function LandingPage() {
    return (
        <main className="landing">

            <div className="frame">

                <div className="logo-frame">

                    <svg
                        className="frame-svg"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >

                        <path
                            d="M2 18 L2 2 L18 2"
                            stroke="var(--gold)"
                            strokeWidth="1"
                            fill="none"
                        />

                        <path
                            d="M82 2 L98 2 L98 18"
                            stroke="var(--gold)"
                            strokeWidth="1"
                            fill="none"
                        />

                        <path
                            d="M2 82 L2 98 L18 98"
                            stroke="var(--gold)"
                            strokeWidth="1"
                            fill="none"
                        />

                        <path
                            d="M88 98 L98 98 L98 78"
                            stroke="var(--gold)"
                            strokeWidth="1"
                            fill="none"
                        />

                    </svg>

                    <h1>PANHORAMIX</h1>

                    <p className="subtitle">
                        Designed for Landscape Cinema
                    </p>

                </div>

            </div>

            <p className="description">
                Experience cinema the way it was meant to be seen.
            </p>

            <div className="actions">

                <Link to="/register">

                    <PHButton>
                        CREATE ACCOUNT
                    </PHButton>

                </Link>

                <p className="login-text">
                    Already have an account?
                </p>
                <Link to="/login">

                    <PHButton>
                        SIGN IN
                    </PHButton>

                </Link>
            </div>
        </main>
    );
}

export default LandingPage;