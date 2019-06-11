


const {nonce, apiRoot, ajaxUrl } = FL_ASSISTANT_CONFIG

import {HttpClient} from "./http-client";

export const useAssistantCloud = () => {

    const cloud = new HttpClient();

    // cloud.defaults.headers.common['Authorize'] = "Bearer " + cookie.cloudToken;

    return cloud;
}

export const useWpRest = () => {
    const http =  new HttpClient({
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

export const useWpAjax = () => {

    class WpAjax extends HttpClient {
        constructor(config = {})  {
            super(config);
            this.transformers.request.push((data) => {
                // @todo this will fail on nested objects
                return Object.keys(data).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                }).join('&');
            })
        }

        postAction(action, data = {}, config = {}) {
            data.action = action;
            return super.post(ajaxUrl, data, config)
        }

        getAction(action, queryParams = {}, config = {}) {
            queryParams.action = action
            return super.get(ajaxUrl, queryParams, config);
        }
    }

    return new WpAjax();
}
