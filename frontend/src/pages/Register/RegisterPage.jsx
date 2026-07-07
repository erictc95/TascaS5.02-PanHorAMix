import { useState } from "react";
import PHButton from "../../components/common/PHButton";
import PHInput from "../../components/common/PHInput";

function RegisterPage() {

    return (

        <main className="landing">

            <div className="logo-frame">

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
                />

                <PHInput
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                />

                <PHInput
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                />

                <PHButton>

                    CREATE ACCOUNT

                </PHButton>

            </div>

        </main>

    );

}

export default RegisterPage;