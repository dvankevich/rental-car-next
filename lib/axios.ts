import axios from "axios";

const api = axios.create({
    baseURL: "https://car-rental-api.goit.global",
    headers: {
        "Content-Type": "application/json",
    },
});

// Перевіряємо, чи ввімкнено логування
const isLoggingEnabled = process.env.NEXT_PUBLIC_API_LOGGING === "true";

//const isLoggingEnabled = false;

if (isLoggingEnabled) {
    api.interceptors.request.use((config) => {
        console.log(
            `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
    });

    api.interceptors.response.use(
        (response) => {
            console.log(
                `✅ [API Response] ${response.status} from ${response.config.url}`,
            );
            return response;
        },
        (error) => {
            console.error(
                `❌ [API Error] ${error.response?.status || "Network Error"} at ${error.config?.url}`,
            );
            return Promise.reject(error);
        },
    );
}

export default api;
