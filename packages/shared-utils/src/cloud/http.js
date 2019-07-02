
import {HttpClient, Interceptor} from "../http"

const {cloudUrl} = FL_ASSISTANT_CONFIG;

console.log('cloudUrl', cloudUrl );
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

console.log(http.defaults.baseUrl, 'baseUrl');

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


export default http;
