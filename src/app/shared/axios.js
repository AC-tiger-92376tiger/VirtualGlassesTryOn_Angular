import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.6.206:8080',
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');

    // Define paths that should not trigger redirect
    const ignoredPaths = ['/auth/login', '/auth/signup'];

    // Check if current request is not in ignoredPaths
    const isIgnored = !config.url || ignoredPaths.some(path => config.url.includes(path));

    if (!token && !isIgnored) {
      window.location.href = '/login';
      return Promise.reject(new Error('No token, redirecting to login'));
    }

    if (token && !ignoredPaths.includes(config.url || '')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


export {api};
