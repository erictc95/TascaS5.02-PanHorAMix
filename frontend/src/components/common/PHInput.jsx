import "./PHInput.css";

function PHInput({
    label,
    type = "text",
    placeholder = "",
    value,
    onChange
}) {

    return (

        <div className="ph-input-group">

            <label className="ph-input-label">
                {label}
            </label>

            <input
                className="ph-input"
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />

        </div>

    );

}

export default PHInput;