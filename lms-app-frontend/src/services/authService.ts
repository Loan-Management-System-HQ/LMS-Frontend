import apiClient from './apiClient';
import API_CONFIG from '../config/apiConfig';

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user: User;
}

export const authService = {
    // Register a new user
    register: async (userData: any) => {
        const response = await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    // Login user
    login: async (credentials: any) => {
        const response = await apiClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Logout user
    logout: async () => {
        try {
            const refresh_token = localStorage.getItem('refresh_token');
            if (refresh_token) {
                await apiClient.post(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, { refresh: refresh_token });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },

    // Get current user profile
    getProfile: async () => {
        const response = await apiClient.get<User>(API_CONFIG.ENDPOINTS.AUTH.PROFILE);
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },

    // Get current user from local storage
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

export default authService;
