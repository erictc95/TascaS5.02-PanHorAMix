import { useEffect, useRef, useState } from "react";
import "./PhamSelect.css";

function PhamSelect({
                        name,
                        value,
                        onChange,
                        options,
                        placeholder = "Select..."
                    }) {
    const [open, setOpen] = useState(false);
    const selectRef = useRef(null);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                selectRef.current &&
                !selectRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        function handleEscape(event) {
            if (event.key === "Escape") {
                setOpen(false);
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    function handleSelect(option) {
        onChange({
            target: {
                name,
                value: option.value
            }
        });

        setOpen(false);
    }

    return (
        <div className="pham-select" ref={selectRef}>

            <button
                type="button"
                className={`pham-select-trigger ${open ? "open" : ""}`}
                onClick={() => setOpen((previous) => !previous)}
            >
                <span className={selectedOption ? "" : "placeholder"}>
                    {selectedOption
                        ? selectedOption.label
                        : placeholder}
                </span>

                <span className="pham-select-arrow">
                    {open ? "▲" : "▼"}
                </span>
            </button>

            {open && (
                <div className="pham-select-menu">

                    {options.map((option) => (
                        <button
                            type="button"
                            key={option.value}
                            className={`pham-select-option ${
                                option.value === value ? "selected" : ""
                            }`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </button>
                    ))}

                </div>
            )}

        </div>
    );
}

export default PhamSelect;