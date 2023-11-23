import axios from 'axios';
import authHeader from "@/services/auth-header";

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL || 'http://localhost:8000/api/', // Replace with your backend URL
    timeout: 720000, // 6 mins timeout
    headers: authHeader(),
});

export default instance;