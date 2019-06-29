const {cloudUrl} = FL_ASSISTANT_CONFIG;

import {HttpClient} from "./http-client"
import {Interceptor} from './interceptors'

const http = new HttpClient({
    baseUrl: cloudUrl,
    credentials: 'same-origin',
    headers: {
        common: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }
});

http.interceptors.request.use(
    new Interceptor(
        (request) => {
            const auth = JSON.parse(localStorage.getItem('fl-cloud-auth'));

            if (auth != null) {
                request.headers['Authorization'] = "Bearer " + auth.access_token;
            }
            return request;
        },
        (error) => {
        }
    ));

// http.interceptors.response.use(
//     new Interceptor(
//         (response) => {
//
//         },
//         (error) => {
//
//         }
//     ));


export default {
    httpClient: http,
    auth: {
        async login(email, password) {
            const credentials = {email, password}
            const auth = await http.post('/auth/login', JSON.stringify(credentials));
            localStorage.setItem('fl-cloud-auth', JSON.stringify(auth));
        },
        async me() {
            const user = await http.post('/auth/me', JSON.stringify({}));
            localStorage.setItem('fl-cloud-user', JSON.stringify(user));
            return user;
        },
        async refresh() {
            const auth = await http.post('/auth/refresh');
            localStorage.setItem('fl-cloud-auth', JSON.stringify(auth));
        },
        async logout() {
            localStorage.removeItem('fl-cloud-auth');
            await http.post('/auth/logout');
        },
        isConnected() {
            const jsonString = localStorage.getItem('fl-cloud-auth');
            return (null !== jsonString);
        },
        getTokenData() {
            const auth = localStorage.getItem('fl-cloud-auth');
            return JSON.parse(auth);
        },
        getUser() {
            const user = localStorage.setItem('fl-cloud-user');
            return JSON.parse(user);
        }
    }
};
