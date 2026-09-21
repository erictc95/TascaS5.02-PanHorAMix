import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

import LandingPage from "../pages/Landing/LandingPage";
import RegisterPage from "../pages/Register/RegisterPage";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/Home/HomePage";
import UploadPage from "../pages/Upload/UploadPage.jsx";
import ProfilePage from "../pages/Profile/ProfilePage.jsx";
import PublicProfilePage from "../pages/PublicProfile/PublicProfilePage.jsx";
import EditProfilePage from "../pages/EditProfile/EditProfilePage.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import MediaPage from "../pages/Media/MediaPage.jsx";
import AdminPage from "../pages/Admin/AdminPage.jsx";
import VerifyEmailPage from "../pages/Auth/VerifyEmailPage.jsx";

function ProtectedRoute({ children }) {
    const token = sessionStorage.getItem("token");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
}

function AdminRoute({ children }) {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (role !== "ADMIN") {
        return <Navigate to="/home" replace />;
    }

    return children;
}

function HomeRoute({ children }) {
    const token = sessionStorage.getItem("token");
    const location = useLocation();

    if (token) {
        return children;
    }

    if (location.state?.fromLanding === true) {
        return children;
    }

    return <Navigate to="/" replace />;
}

function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Públicas */}

                <Route path="/" element={<LandingPage />} />

                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                <Route path="/verify-email" element={<VerifyEmailPage />} />

                {/* Privadas */}

                <Route element={<AppLayout />}>

                    <Route path="/home" element={<HomeRoute><HomePage /></HomeRoute>} />

                    <Route path="/media/:id" element={<ProtectedRoute><MediaPage /></ProtectedRoute>} />

                    <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />

                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

                    <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />

                    <Route path="/users/:username" element={<ProtectedRoute><PublicProfilePage /></ProtectedRoute>} />

                    <Route path="/admin" element={<AdminRoute> <AdminPage /> </AdminRoute>}/>


                </Route>

            </Routes>

        </BrowserRouter>

    );

}

export default AppRouter;