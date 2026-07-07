import "./LandingPage.css";
import { Link } from "react-router-dom";
import PHButton from "../../components/common/PHButton";

function LandingPage() {
    return (
        <main className="landing">

            <div className="logo-frame">

                <span className="corner bottom-left"></span>
                <span className="corner bottom-right"></span>

                <h1>PANHORAMIX</h1>

                <p className="subtitle">
                    Designed for Landscape Cinema
                </p>

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

                <PHButton>
                    SIGN IN
                </PHButton>

            </div>
        </main>
    );
}

export default LandingPage;