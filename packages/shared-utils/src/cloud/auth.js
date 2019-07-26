import axios from 'axios'
import Promise from 'promise'
import * as session from './session'

const {cloudUrl} = FL_ASSISTANT_CONFIG;

const freshCancelToken = () => {
    return axios.CancelToken.source();
}

const currentRequest = {
    active: false,
    source: freshCancelToken()
}

/**
 * Create new axios instance
 * @type {AxiosInstance}
 */
const http = axios.create({
    baseURL: cloudUrl
});

/**
 * Attach JWT token to every request, if it exists
 */
http.interceptors.request.use((config) => {
    // mark request as active
    currentRequest.active = true;
    // attach jwt token to request
    if (session.hasToken()) {
        config.headers['Authorization'] = "Bearer " + session.getToken().access_token;
    }
    return config;
}, Promise.reject);


http.interceptors.response.use((config) => {
    currentRequest.active = false
    return config
}, (error) => {
    currentRequest.active = false
    return error
})

/**
 * Is there an active request?
 * @returns {boolean}
 */
export const isActive = () => {
    return currentRequest.active
}

/**
 * Cancel any running requests
 * @param message
 */
export const cancel = (message) => {
    currentRequest.source.cancel(message)
    currentRequest.source = freshCancelToken()
}

/**
 * Refresh the users token once per minute
 * @type {number}
 */
const interval = setInterval(async () => {
    if (session.hasToken()) {
        try {
            await refresh()
        } catch (error) {
            clearInterval(interval)
        }
    }
}, 60000)

/**
 * Login to Assistant Cloud
 *
 * @param email
 * @param password
 * @param config
 * @returns Promise
 */
export const login = (email, password, config = {}) => {

    // Wrap axios promise in our own promise
    return new Promise((resolve, reject) => {

        http.post('/auth/login', {email, password}, config)
            .then((response) => {
                // server returns JWT
                const token = response.data
                // if returned object is JWT and not empty object or error message
                if (session.isValidToken(token)) {
                    // save the token in localStorage
                    session.setToken(token)
                    // resolve the promise
                    resolve(token)
                } else {
                    // reject promise with error
                    reject(new Error('Received invalid token from the server'))
                }
            })
            .catch(reject)

    })

}

/**
 * Get Cloud User info
 * @param config
 * @returns {Promise<T>}
 */
export const fetchCurrentUser = async (config = {}) => {
    const response = await http.post('/auth/me', {}, config)
    const user = response.data
    session.setUser(user)
    return user
}

/**
 * Refresh JWT token
 * @param config
 * @returns Promise
 */
export const refresh = (config = {}) => {

    // Wrap axios promise in our own promise
    return new Promise((resolve, reject) => {
        console.log('refreshing token')

        // attempt to refresh JWT
        http.post('/auth/refresh', {}, config)
            .then((response) => {
                const token = response.data
                // if server returns valid JWT
                if (session.isValidToken(token)) {
                    // save to localStorage
                    session.setToken(token)
                    // resolve promise with token
                    resolve(token)
                } else {
                    // reject promise with error
                    reject(new Error('Received invalid refresh token.'))
                }

            }).catch(reject)
    })

}

/**
 * Clear JWT token locally and on server
 * @param config
 * @returns Promise
 */
export const logout = (config = {}) => {

    return new Promise((resolve, reject) => {
        http.post('/auth/logout', {}, config)
            .then((response) => {
                resolve()
            })
            .catch((error) => {
                console.log('could not invalidate token on the server', error.message)
                reject(error)
            })
            .finally(() => {
                session.removeToken()
                session.removeUser()
            })
    })
}

/**
 * Session has token and user.
 * @returns bool
 */
export const isConnected = () => {
    return session.hasToken() && session.hasUser()
}



