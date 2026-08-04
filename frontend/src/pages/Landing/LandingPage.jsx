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

                        <defs>

                            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">

                                <stop offset="0%" stopColor="#FFE89A"/>

                                <stop offset="35%" stopColor="#F8D86A"/>

                                <stop offset="65%" stopColor="#D8A42E"/>

                                <stop offset="100%" stopColor="#A56A05"/>

                            </linearGradient>

                        </defs>

                        {/* Superior izquierda */}

                        <path
                            d="M4 24 L4 8 Q4 4 8 4 L16 4"
                            stroke="url(#goldGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />

                        {/* Superior derecha */}

                        <path
                            d="M84 4 L92 4 Q96 4 96 8 L96 24"
                            stroke="url(#goldGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />

                        {/* Inferior izquierda */}

                        <path
                            d="M4 76 L4 92 Q4 96 8 96 L16 96"
                            stroke="url(#goldGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                        />

                        {/* Inferior derecha */}

                        <path
                            d="M84 96 L92 96 Q96 96 96 92 L96 76"
                            stroke="url(#goldGradient)"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
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