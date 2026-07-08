import { useState } from "react";
import { Link } from "react-router-dom";

import "./RegisterPage.css";

import PHButton from "../../components/common/PHButton";
import PHInput from "../../components/common/PHInput";

import { register } from "../../api/authService";

function RegisterPage() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleRegister() {

        setSuccessMessage("");
        setErrorMessage("");

        if (!username.trim()) {
            setErrorMessage("Username is required.");
            return;
        }

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

        const request = {
            username,
            email,
            password
        };

        try {

            await register(request);

            setSuccessMessage("Account created successfully!");

            setUsername("");
            setEmail("");
            setPassword("");

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

        <main className="register-page">

            <div className="register-container">

                <div className="logo-frame">

                    <span className="corner top-left"></span>
                    <span className="corner top-right"></span>
                    <span className="corner bottom-left"></span>
                    <span className="corner bottom-right"></span>

                    <h1>REGISTER</h1>

                    <p className="subtitle">
                        Create your PanHorAMix account
                    </p>

                </div>

                <div className="register-form">

                    <PHInput
                        label="Username"
                        placeholder="Choose your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

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

                    <PHButton
                        onClick={handleRegister}
                    >
                        CREATE ACCOUNT
                    </PHButton>

                    {successMessage && (

                        <div className="success-box">

                            <p>{successMessage}</p>

                            <Link
                                className="login-link"
                                to="/login"
                            >

                                <PHButton>

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

    );

}

export default RegisterPage;