import api from "./axiosConfig";

export async function getProfile() {

    const response = await api.get("/users/me");

    return response.data;
}

export async function updateProfile(formData) {
    const response = await api.put(
        "/users/me",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );

    return response.data;
}

export async function getPublicProfile(username) {

    const response = await api.get(`/users/${username}`);

    return response.data;
}

export async function updateAvatarEnabled(enabled) {
    const response = await api.patch(
        "/users/me/avatar-enabled",
        null,
        {
            params: {
                enabled
            }
        }
    );

    return response.data;
}

export async function updateBannerEnabled(enabled) {
    const response = await api.patch(
        "/users/me/banner-enabled",
        null,
        {
            params: {
                enabled
            }
        }
    );

    return response.data;
}