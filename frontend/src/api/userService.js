import api from "./axiosConfig";

export async function getProfile() {

    const response = await api.get("/users/me");

    return response.data;
}