import {HttpClient} from "../http"

const {cloudUrl} = FL_ASSISTANT_CONFIG;

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

// this is a json api
http.transformers.request.push((body) => {
    return JSON.stringify(body);
});


export default http;
