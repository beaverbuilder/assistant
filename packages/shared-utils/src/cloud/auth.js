import http from './http'

const FL_CLOUD_AUTH_STORAGE_KEY = "fl-cloud-auth";
const FL_CLOUD_USER_KEY = "fl-cloud-user";

export const hasToken = () => {
    const auth = localStorage.getItem(FL_CLOUD_AUTH_STORAGE_KEY);
    return (null !== auth)
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
    const user = localStorage.getItem(FL_CLOUD_USER_KEY);
    return (null !== user)
}

export const getUser = () => {
    const user = localStorage.getItem(FL_CLOUD_USER_KEY);
    return JSON.stringify(user)
}

export const setUser = (user) => {
    localStorage.setItem(FL_CLOUD_USER_KEY, JSON.stringify(user));
}

export const removeUser = () =>  {
    localStorage.removeItem(FL_CLOUD_USER_KEY);
}

export const login = async (email, password) => {
    const credentials = {email, password}
    const auth = await http.post('/auth/login', JSON.stringify(credentials));
    setToken(auth);
    const user = await me();
    return user;
}

export const me = async () => {
    const user = await http.post('/auth/me', JSON.stringify({}));
    setUser(user);
    return user;
}

export const refresh = async () => {
    const auth = await http.post('/auth/refresh');
    setToken(auth);
}

export const logout = async () => {
    removeToken();
    return await http.post('/auth/logout');
}

export const isConnected = () => {
    return hasToken() && hasUser()
}



