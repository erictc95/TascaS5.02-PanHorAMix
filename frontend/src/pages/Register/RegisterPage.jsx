import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import "./RegisterPage.css";

import PHButton from "../../components/common/PHButton";
import PHInput from "../../components/common/PHInput";
import Toast from "../../components/common/Toast/Toast.jsx";

import {register} from "../../api/authService";
import registerLogo from "../../assets/brand/Panhoramix-register-logo.png";

function RegisterPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [toastStep, setToastStep] = useState(0);

    useEffect(() => {
        if (toastStep === 0) {
            return;
        }

        const timer = setTimeout(() => {
            if (toastStep === 1) {
                setToastStep(2);
            } else {
                setToastStep(0);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [toastStep]);

    async function handleRegister() {

        setSuccessMessage("");
        setErrorMessage("");

        if (!email.trim()) {
            setErrorMessage("Email is required.");
            return;
        }

        if (!password.trim()) {
            setErrorMessage("Password is required.");
            return;
        }

        if (password.length < 8) {
            setErrorMessage("Password must contain at least 8 characters.");
            return;
        }

        if (!username.trim()) {
            setErrorMessage("Username is required.");
            return;
        }

        const request = {
            email,
            password,
            username
        };

        try {

            await register(request);

            setSuccessMessage("Account created successfully!");
            setErrorMessage("");
            setToastStep(1);

            setEmail("");
            setPassword("");
            setUsername("");

        } catch (error) {

            const code = error.response?.data?.code;

            switch (code) {

                case "EMAIL_ALREADY_EXISTS":
                    setErrorMessage("This email is already registered.");
                    break;

                case "USERNAME_ALREADY_EXISTS":
                    setErrorMessage("This username is already taken.");
                    break;

                default:
                    setErrorMessage("Unexpected server error.");
                    break;

            }

        }

    }

    return (
        <>
            <Toast
                visible={toastStep !== 0}
                title={
                    toastStep === 1
                        ? "ACCOUNT CREATED"
                        : "CHECK YOUR EMAIL"
                }
                message={
                    toastStep === 1
                        ? "Your account has been created successfully."
                        : "We've sent a verification email to your registered email address."
                }
                type="success"
            />

            <main className="register-page">

                <div className="register-container">

                    <div className="logo-frame">

                        <img
                            src={registerLogo}
                            alt="PanHorAMix"
                            className="register-logo"
                        />

                    </div>

                    <p className="subtitle">
                        Join the landscape revolution
                    </p>

                    <div className="register-form">

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
                            placeholder="Create your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <PHInput
                            label="Username"
                            placeholder="Choose your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <PHButton
                            onClick={handleRegister}
                        >
                            CREATE ACCOUNT
                        </PHButton>

                        <p className="login-text">
                            Already have an account?
                        </p>

                        <Link to="/login">

                            <PHButton>
                                SIGN IN
                            </PHButton>

                        </Link>

                        {successMessage && (
                            <div className="success-box">

                                <p className="verification-title">
                                    CHECK YOUR EMAIL
                                </p>

                                <p className="verification-message">
                                    We've sent a verification email to your registered email address.
                                    Please verify your email before signing in.
                                </p>

                                <Link
                                    className="login-link"
                                    to="/login"
                                >
                                    <PHButton className="go-to-login-button">
                                        GO TO LOGIN
                                    </PHButton>
                                </Link>

                            </div>
                        )}

                        {errorMessage && (

                            <div className="error-box">

                                {errorMessage}

                            </div>

                        )}

                    </div>

                </div>

            </main>

        </>

    );

}

export default RegisterPage;