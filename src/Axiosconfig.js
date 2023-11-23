import axios from 'axios';
import authHeader from "@/services/auth-header";

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL || 'http://localhost:8000/api/', // Replace with your Django backend URL
    timeout: 36000, // 6 mins timeout
    headers: authHeader(),
});

export default instance;