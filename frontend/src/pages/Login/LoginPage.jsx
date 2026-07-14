import { useState } from "react";
import { Link } from "react-router-dom";

import "./LoginPage.css";

import PHButton from "../../components/common/PHButton";
import PHInput from "../../components/common/PHInput";

import { login } from "../../api/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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

            console.log("Login successful");

            navigate("/home");

            // Más adelante redirigiremos al usuario.

        } catch (error) {

            setError("Invalid email or password.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <main className="login-page">

            <div className="login-container">

                <div className="logo-frame">

                    <span className="corner top-left"></span>
                    <span className="corner top-right"></span>
                    <span className="corner bottom-left"></span>
                    <span className="corner bottom-right"></span>

                    <h1>LOGIN</h1>

                    <p className="subtitle">
                        Welcome back to PanHorAMix
                    </p>

                </div>

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