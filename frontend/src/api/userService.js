import api from "./axiosConfig";

export async function getProfile() {

    const response = await api.get("/users/me");

    return response.data;
}

export async function getPublicProfile(username) {

    const response = await api.get(`/users/${username}`);

    return response.data;
}