import "./LandingPage.css";
import {Link} from "react-router-dom";
import PHButton from "../../components/common/PHButton";
import landingLogo from "../../assets/brand/panhoramix-landscape-logo.png";

function LandingPage() {
    return (
        <main className="landing-page">

            <div className="choose-container">

                <div className="logo-frame">

                    <img
                        src={landingLogo}
                        alt="PanHorAMix"
                        className="landing-logo"
                    />

                </div>

                <p className="subtitle">
                    Experience cinema the way it was meant to be seen.
                </p>

                <div className="choose-form">

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

            </div>

        </main>
    );
}

export default LandingPage;