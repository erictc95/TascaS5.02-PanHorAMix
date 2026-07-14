import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import RegisterPage from "../pages/Register/RegisterPage";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/home/HomePage";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<LandingPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/home"
                    element={<HomePage />}
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;