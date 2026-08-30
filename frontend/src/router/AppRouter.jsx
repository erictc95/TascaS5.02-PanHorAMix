import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import RegisterPage from "../pages/Register/RegisterPage";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/Home/HomePage";
import FirstTakePage from "../pages/FirstTake/FirstTakePage.jsx";
import ProfilePage from "../pages/Profile/ProfilePage.jsx";
import PublicProfilePage from "../pages/PublicProfile/PublicProfilePage.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import MediaPage from "../pages/Media/MediaPage.jsx";

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Públicas */}

                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                {/* Privadas */}

                <Route element={<AppLayout />}>

                    <Route path="/home" element={<HomePage />} />

                    <Route path="/media/:id" element={<MediaPage />} />

                    <Route path="/upload" element={<FirstTakePage />} />

                    <Route path="/profile" element={<ProfilePage />} />

                    <Route path="/users/:username" element={<PublicProfilePage />} />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;