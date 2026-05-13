import axios from 'axios';
import authHeader from "@/services/auth-header";

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL, // Replace with your backend URL
    timeout: 720000, // 6 mins timeout
});

// Attach the latest auth header on every request so the token picked up
// after login (or refresh) is always used, instead of the empty header
// captured at module-load time.
instance.interceptors.request.use((config) => {
    const headers = authHeader();
    Object.assign(config.headers, headers);
    return config;
});

export default instance;