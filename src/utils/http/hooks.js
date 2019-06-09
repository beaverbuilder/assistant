/**
 * @todo this works in every other module but breaks everything here. I have no idea why
 */
// import { getSystemConfig } from "../../front/store/system";
// const {nonce, apiRoot, ajaxUrl } = getSystemConfig();
const {nonce, apiRoot, ajaxUrl} = FL_ASSISTANT_CONFIG;

import {HttpClient} from "./http-client";

export const useAssistantCloud = () => {

    const cloud = new HttpClient();

    // cloud.defaults.headers.common['Authorize'] = "Bearer " + cookie.cloudToken;

    return cloud;
}

export const useWpRest = () => {
    return new HttpClient({
        baseUrl: apiRoot,
        credentials: 'same-origin',
        headers: {
            common: {
                'X-WP-Nonce': nonce.api
            }
        }
    });
}

export const useWpAjax = () => {

    class WpAjax extends HttpClient {
        constructor(config = {})  {
            super(config);
            this.transformers.request.push((data) => {
                // @todo this will fail on deep object maps
                return Object.keys(data).map((key) => {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
                }).join('&');
            })
        }

        postAction(action, data = {}, config = {}) {
            console.log('Ajax Post Action', action);
            data.action = action;
            return super.post(ajaxUrl, data, config)
        }

        getAction(action, queryParams = {}, config = {}) {
            console.log('Ajax Get Action', action);
            queryParams.action = action
            return super.get(ajaxUrl, queryParams, config);
        }
    }

    return new WpAjax();
}
