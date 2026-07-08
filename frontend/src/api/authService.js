import api from "./axiosConfig";

export async function register(request) {

    const response = await api.post(
        "/auth/register",
        request
    );

    return response.data;

}