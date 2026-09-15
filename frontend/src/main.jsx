import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles/global.css";

import App from "./App";

import { ToastProvider } from "./context/ToastContext";

document.addEventListener("touchmove", (event) => {
    if (event.touches.length > 1) {
        event.preventDefault();
    }
}, { passive: false });

document.addEventListener("gesturestart", (event) => {
    event.preventDefault();
});

document.addEventListener("gesturechange", (event) => {
    event.preventDefault();
});

document.addEventListener("gestureend", (event) => {
    event.preventDefault();
});

createRoot(document.getElementById("root")).render(

    <StrictMode>

        <ToastProvider>

            <App />

        </ToastProvider>

    </StrictMode>

);
