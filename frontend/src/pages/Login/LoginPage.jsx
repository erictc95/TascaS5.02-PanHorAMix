import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import "./LoginPage.css";

import PHButton from "../../components/common/PHButton";
import PHInput from "../../components/common/PHInput";

import {login, resendVerification} from "../../api/authService";
import {useNavigate} from "react-router-dom";
import loginLogo from "../../assets/brand/Panhoramix-login-logo.png";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [emailNotVerified, setEmailNotVerified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    const [resendCooldown, setResendCooldown] = useState(0);

    const navigate = useNavigate();

    const handleLogin = async () => {

        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        try {

            setLoading(true);

            const response = await login({
                email,
                password
            });

            console.log(response);

            sessionStorage.setItem("token", response.token);

            sessionStorage.setItem("role", response.role);

            console.log("Login successful");

            navigate("/home");


        } catch (error) {

            if (error.response?.data?.code === "EMAIL_NOT_VERIFIED") {
                setEmailNotVerified(true);
                setError("Your email address is not verified.");
            } else {
                setEmailNotVerified(false);
                setError("Invalid email or password.");
            }

        } finally {

            setLoading(false);

        }

    };

    const handleResendVerification = async () => {

        setResendLoading(true);
        setResendMessage("");
        setError("");

        try {

            await resendVerification(email);

            setResendCooldown(300);

            setResendMessage(
                "Verification email sent. Please check your inbox."
            );

        } catch (error) {

            setResendMessage(
                "Unable to resend the verification email. Please try again."
            );

        } finally {

            setResendLoading(false);

        }
    };

    useEffect(() => {

        if (resendCooldown <= 0) {
            return;
        }

        const timer = setInterval(() => {
            setResendCooldown((previous) => previous - 1);
        }, 1000);

        return () => clearInterval(timer);

    }, [resendCooldown]);

    return (

        <main className="login-page">

            <div className="login-container">

                <div className="logo-frame">

                    <img
                        src={loginLogo}
                        alt="PanHorAMix"
                        className="login-logo"
                    />

                </div>

                <p className="subtitle">
                    Keep building your cinematic world
                </p>

                <div className="login-form">

                    <PHInput
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <PHInput
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {error && (
                        <p className="login-error">
                            {error}
                        </p>
                    )}

                    {emailNotVerified && (
                        <PHButton
                            onClick={handleResendVerification}
                            disabled={resendLoading || resendCooldown > 0}
                        >
                            {resendLoading
                                ? "SENDING..."
                                : resendCooldown > 0
                                    ? `RESEND VERIFICATION EMAIL (${Math.floor(resendCooldown / 60)}:${String(resendCooldown % 60).padStart(2, "0")})`
                                    : "RESEND VERIFICATION EMAIL"}
                        </PHButton>
                    )}

                    {resendMessage && (
                        <p className="login-message">
                            {resendMessage}
                        </p>
                    )}

                    <PHButton
                        onClick={handleLogin}
                        disabled={loading}
                    >

                        {loading ? "SIGNING IN..." : "SIGN IN"}

                    </PHButton>

                    <p className="register-text">
                        Don't have an account?
                    </p>

                    <Link
                        className="register-link"
                        to="/register"
                    >

                        <PHButton>

                            CREATE ACCOUNT

                        </PHButton>

                    </Link>

                </div>

            </div>

        </main>

    );

}

export default LoginPage;