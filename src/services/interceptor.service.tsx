import axios from 'axios';
import { API_BASE } from '@env';
import { Auth } from '../types';
import { store } from '../redux/store';
import { setAuth } from "../redux/reducers/auth.reducer";
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    timeout: 10000,
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    async (response) => {
        return response;
    },
    async (error) => {
        console.log('error', error.response);
        if (error.response.status === 401) {
            await logout();
        }
        return Promise.reject(error);
    }
);

export const logout = async () => {
    try {
        await AsyncStorage.removeItem('token');
        store.dispatch(setAuth({} as Auth));
    } catch (ex) {
        console.log('logout ex', ex);
    }
}

export default axiosInstance;


