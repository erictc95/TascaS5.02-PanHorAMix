import api from "./axiosConfig";

export async function register(request) {

    const response = await api.post(
        "/auth/register",
        request
    );

    return response.data;

}

export async function login(request) {

    const response = await api.post(
        "/auth/login",
        request
    );

    return response.data;

}