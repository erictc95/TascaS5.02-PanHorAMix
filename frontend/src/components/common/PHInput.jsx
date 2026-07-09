import { useState } from "react";
import "./PHInput.css";

function PHInput({
                     label,
                     type = "text",
                     placeholder = "",
                     value,
                     onChange
                 }) {

    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? (showPassword ? "text" : "password")
            : type;

    return (

        <div className="ph-input-group">

            <label className="ph-input-label">
                {label}
            </label>

            <div className="ph-input-container">

                <input
                    className="ph-input"
                    type={inputType}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                />

                {type === "password" && (

                    <button
                        type="button"
                        className="ph-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "🙈" : "🐵"}
                    </button>

                )}

            </div>

        </div>

    );

}

export default PHInput;