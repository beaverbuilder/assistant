const {nonce, apiRoot, ajaxUrl} = FL_ASSISTANT_CONFIG;

import {HttpClient} from "./http-client";

export const getWpRest = () => {
    const http = new HttpClient({
        baseUrl: apiRoot,
        credentials: 'same-origin',
        headers: {
            common: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-WP-Nonce': nonce.api
            }
        }
    });

    http.transformers.request.push((data) => {
        return JSON.stringify(data);
    });

    return http;
}

export const getWpAjax = () => {

    const http = new HttpClient({
        credentials: 'same-origin'
    });

    http.transformers.request.push((data) => {
        // @todo this will fail on nested objects
        return Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
    });

    http.postAction = (action, data = {}, config = {}) => {
        data.action = action;
        return http.post(ajaxUrl, data, config)
    }

    http.getAction = (action, queryParams = {}, config = {}) => {
        queryParams.action = action
        return http.get(ajaxUrl, queryParams, config);
    }


    return http;
}

