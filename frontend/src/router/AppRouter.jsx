import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import RegisterPage from "../pages/Register/RegisterPage";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<LandingPage />} />

                <Route path="/register" element={<RegisterPage />} />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;