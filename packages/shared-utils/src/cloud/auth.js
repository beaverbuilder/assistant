import axios from 'axios'
import Promise from 'promise'
const {cloudUrl} = FL_ASSISTANT_CONFIG;

import * as session from './session'

const CancelToken = axios.CancelToken;
const source = CancelToken.source();


/**
 * Request interceptor - If an auth token exists, append an Authorization header
 *
 * @param config
 * @returns {*}
 */
const attachAuthorization = (config) => {
    // attach jwt token to request
    if (session.hasToken()) {
        config.headers['Authorization'] = "Bearer " + session.getToken().access_token;
    }
    return config;
}

/**
 * Request interceptor - Attaches Cancel Token to all requests
 * @param config
 * @returns {*}
 */
const attachCancelToken = (config) => {
    config.cancelToken = source.token
    return config;
}

/**
 * Response interceptor - on error - Do something if unauthorized
 *
 * @param error
 * @returns {*}
 */
const handleAuthError = (error) => {
    if (error.response && error.response.status == 401) {
        session.removeToken();
    }

    if (error.response && error.response.status === 403) {
        alert('Forbidden\n' + JSON.stringify(response.body));
    }

    fireLoginFailed(error);

    return Promise.reject(error);
}

/**
 * Create new axios instance
 * @type {AxiosInstance}
 */
const http = axios.create({
    baseURL: cloudUrl
});

/**
 * Attach interceptors
 */
http.interceptors.request.use(attachAuthorization, Promise.reject);
http.interceptors.request.use(attachCancelToken, Promise.reject);
http.interceptors.response.use(Promise.resolve, handleAuthError)


const interval = setInterval(async () => {
    if (session.hasToken()) {
        console.log('refreshing token', session.getToken());
        try {
            await refresh();
        } catch (error) {
            console.log(error);
            clearInterval(interval);
        }
    }
}, 60000);


/**
 * Cancel / Abort all cloud auth requests
 * @param message
 */
export const cancel = (message = null) => {
    source.cancel(message)
}

/**
 * Login to Assistant Cloud
 * @param email
 * @param password
 * @param config
 */
export const login = (email, password, config = {}) => {

    return new Promise((resolve, reject) => {
        const credentials = {email, password}
        return http.post('/auth/login', credentials, config)
            .then((response) => {
                const token = response.data;
                session.setToken(token);
                fireLoginSuccess(response);
                return resolve(token);
            })
            .catch((error) => {
                fireLoginFailed(error);
                return reject(error);
            })

    })

}

/**
 * Get Cloud User info
 * @param config
 */
export const me = async (config = {}) => {
    const response = await http.post('/auth/me', {}, config);
    return response.data;
}

/**
 * Refresh JWT token
 * @param config
 * @returns {Promise<any>}
 */
export const refresh = async (config = {}) => {
    try {
        console.log('refreshing token');
        const response = await http.post('/auth/refresh', {}, config);
        session.setToken(response.data);
        return session.getToken();
        fireLoginSuccess(response);
    } catch (error) {
        fireLoginFailed(error)
    }
}

/**
 * Clear JWT token locally and on server
 * @param config
 * @returns {Promise<void>}
 */
export const logout = async (config = {}) => {
    await http.post('/auth/logout', {}, config);
    session.removeToken();
}

/**
 * Session has token and user.
 * @returns bool
 */
export const isConnected = () => {
    return session.hasToken()
}

const loginFailureCallbacks = [];
export const onLoginFailure = (callback) => {
    loginFailureCallbacks.push(callback);
}

export const fireLoginFailed = (error) => {
    loginFailureCallbacks.forEach((callback) => {
        callback(error);
    });
}

const loginSuccessCallbacks = [];
export const onLoginSuccess = (callback) => {
    loginSuccessCallbacks.push(callback);
}

export const fireLoginSuccess = (response) => {
    loginSuccessCallbacks.forEach((callback) => {
        callback(response);
    });
}

const logoutCallbacks = [];
export const onLogout = (callback) => {
    logoutCallbacks.push(callback);
}

const fireOnLogout = () => {
    logoutCallbacks.forEach((callback) => {
        callback();
    })
}



