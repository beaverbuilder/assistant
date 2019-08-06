import http from './http'
import { isObject } from 'lodash'

const FL_CLOUD_AUTH_STORAGE_KEY = "fl-cloud-auth";
const FL_CLOUD_USER_KEY = "fl-cloud-user";

// If an auth token exists, append an Authorization header
http.interceptors.request.use(
    (request) => {
        const auth = getToken();

        if (auth != null) {
            request.headers['Authorization'] = "Bearer " + auth.access_token;
        }
        return request;
    },
    (error) => {}
);


http.interceptors.response.use(
        (response) => {
            if(response.status === 401) {

                removeToken();
                removeUser();
                alert('Unauthorized\n' + JSON.stringify(response.body));
            }

            if(response.status === 403) {
                alert('Forbidden\n' + JSON.stringify(response.body));
            }

            return response;
        },
        (error) => {}
);

export const hasToken = () => {
    return (isObject(getToken()));
}

export const getToken = () => {
    const auth = localStorage.getItem(FL_CLOUD_AUTH_STORAGE_KEY);
    return JSON.parse(auth);
}

export const setToken = (token) => {
    localStorage.setItem(FL_CLOUD_AUTH_STORAGE_KEY, JSON.stringify(token));
}

export const removeToken = () => {
    localStorage.removeItem(FL_CLOUD_AUTH_STORAGE_KEY);
}

export const hasUser = () => {
    return (isObject(getUser()));
}

export const getUser = () => {
    const user = localStorage.getItem(FL_CLOUD_USER_KEY);
    return JSON.parse(user)
}

export const setUser = (user) => {
    localStorage.setItem(FL_CLOUD_USER_KEY, JSON.stringify(user));
}

export const removeUser = () => {
    localStorage.removeItem(FL_CLOUD_USER_KEY);
}

export const login = async (email, password) => {
    const credentials = {email, password}
    const auth = await http.post('/auth/login', credentials);
    setToken(auth);
    const user = await me();
    notifyAuthStatusChanged();
    return user;
}

export const me = async () => {
    const user = await http.post('/auth/me');
    setUser(user);
    return user;
}

export const refresh = async () => {
    const auth = await http.post('/auth/refresh');
    setToken(auth);
    notifyAuthStatusChanged();
}

export const logout = async () => {
    await http.post('/auth/logout');
    removeToken();
    removeUser();
    notifyAuthStatusChanged();
}

export const isConnected = () => {
    return (hasToken() && hasUser())
}


const statusChangeHandlers = [];

export const onAuthStatusChanged = (callback) => {
    statusChangeHandlers.push(callback);
}

const notifyAuthStatusChanged = () => {
    statusChangeHandlers.forEach((handler) => {
        handler();
    })
}


