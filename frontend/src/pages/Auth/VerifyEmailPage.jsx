import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import "./VerifyEmailPage.css";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Verification link is invalid.");
            return;
        }

        async function verifyEmail() {
            try {
                await api.get("/auth/verify-email", {
                    params: {
                        token
                    }
                });

                setStatus("success");
            } catch (error) {
                console.error("Email verification failed:", error);

                setStatus("error");
                setMessage(
                    "This verification link is invalid or has expired."
                );
            }
        }

        verifyEmail();
    }, [searchParams]);

    return (
        <main className="verify-email-page">
            <section className="verify-email-card">

                {status === "loading" && (
                    <>
                        <h1>Verifying your email...</h1>
                        <p>Please wait while we verify your account.</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h1>Email verified</h1>

                        <p>
                            Your email address has been successfully verified.
                        </p>

                        <p>
                            You can now log in to PanHorAMix.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h1>Verification failed</h1>

                        <p>{message}</p>

                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Go to Login
                        </button>
                    </>
                )}

            </section>
        </main>
    );
}