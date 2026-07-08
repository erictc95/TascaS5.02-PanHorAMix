import { useState } from "react";

import PHButton from "../../components/common/PHButton";
import PHInput from "../../components/common/PHInput";

import { register } from "../../api/authService";

function RegisterPage() {

    const [username, setUsername] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function handleRegister() {

        const request = {

            username,
            email,
            password

        };

        try {

            const response = await register(request);

            console.log(response);

            alert("User created successfully!");

        } catch (error) {

            console.error(error);

            alert("Error creating user.");

        }

    }

    return (

        <main className="landing">

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

            <div className="actions">

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
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <PHButton
                    onClick={handleRegister}
                >
                    CREATE ACCOUNT
                </PHButton>

            </div>

        </main>

    );

}

export default RegisterPage;