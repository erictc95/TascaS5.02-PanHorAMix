import "./LandingPage.css";

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

            <button className="primary-button">
                CREATE ACCOUNT
            </button>

            <p className="login-text">
                Already have an account?
            </p>

            <button className="secondary-button">
                SIGN IN
            </button>
        </main>
    );
}

export default LandingPage;