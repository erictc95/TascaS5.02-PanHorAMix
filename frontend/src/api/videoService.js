import api from "./axiosConfig";

const videoService = {

    async createMedia(formData) {

        const response = await api.post(
            "/media",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data;

    },

    async getMedia(page = 0) {

        const response = await api.get("/media", {
            params: {
                page
            }
        });

        return response.data;

    },

    async getMediaById(id) {

        const response = await api.get(`/media/${id}`);

        return response.data;

    },

    async deleteMedia(id) {

        await api.delete(`/media/${id}`);

    }

};

export default videoService;