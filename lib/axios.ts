import axios from "axios";

const api = axios.create({
    baseURL: "https://car-rental-api.goit.global",
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
