import axios from 'axios';
import authHeader from "@/services/auth-header";
import { handleResponseError } from "@/services/unauthenticated";

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

// When the backend replies 401 {"message":"Unauthenticated."} (missing,
// expired or revoked token) the user is signed out and re-routed to the
// login page. The error is still re-thrown for the caller's error handling.
instance.interceptors.response.use(
    (response) => response,
    handleResponseError
);

export default instance;