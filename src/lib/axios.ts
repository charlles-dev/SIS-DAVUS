import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://davus-backend.onrender.com/api/v1',
    timeout: 60000, // 60 seconds
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;

        // Retry on 502/504 (Cold Start / Gateway issues)
        if (response && (response.status === 502 || response.status === 504)) {
            if (!config._retryCount) {
                config._retryCount = 0;
            }

            if (config._retryCount < 3) {
                config._retryCount += 1;
                const delay = 1000 * (2 ** config._retryCount); // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, delay));
                return api(config);
            }
        }

        return Promise.reject(error);
    }
);
