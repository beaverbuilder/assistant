import defaults from './defaults'
import {InterceptorManager} from "./interceptors";
import {addQueryArgs, isAbsoluteURL} from "../url";
import {merge, clone} from 'lodash'

export const defaultBodyParser = (response) => {
    const type = response.headers.get('content-type')

    if (type.includes('text/xml') || type.includes('text/html')) {
        return response.text()
    }

    return response.json()
}

export class HttpClient {

    constructor(config) {

        this.bodyParser = defaultBodyParser

        this.transformers = {
            request: [],
            response: []
        }

        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };

        this.defaults = merge(defaults, config);

    }

    _transformRequest(body) {
        // this.transformers.request.forEach((fn) => {
        //     config.body = fn(config.body);
        // })
        return body;
    }

    _transformResponse(data) {
        this.transformers.response.forEach((transformer) => {
            data = transformer(data);
        })
        return data;
    }

    _interceptRequest(config) {
        // this.interceptors.request.handlers.forEach((interceptor) => {
        //     try {
        //         config = interceptor.fulfilled(config)
        //     } catch (ex) {
        //         interceptor.rejected(ex);
        //     }
        // })
        return config;
    }

    _interceptResponse(response) {
        // this.interceptors.response.handlers.forEach((interceptor) => {
        //     try {
        //         response = interceptor.fulfilled(response)
        //     } catch (ex) {
        //         interceptor.rejected(ex);
        //     }
        // });
        return response;
    }

    request(method, url, config = {}) {
        config = merge(this.defaults, config);

        const headers = merge(this.defaults.headers.common, this.defaults.headers[method.toLowerCase()])


        if (config.baseUrl && !isAbsoluteURL(url)) {
            url = config.baseUrl + url;
        }

        let request = {
            method,
            headers,
            credentials: config.credentials,
            body: config.body,
        };

        request.body = this._transformRequest(request.body);
        request = this._interceptRequest(request);

        return fetch(url, request)
            .then((response) => {

                if (!response.ok) {
                    reject(new Error(response.statusText));
                }

                response = this._interceptResponse(response);

                return this.bodyParser(response);
            })
            .then((data) => {
                return this._transformResponse(data);
            });

    }

    get(url, query = {}, config = {}) {
        return this.request('GET', addQueryArgs(url, query), config)
    }

    post(url, data = {}, config = {}) {
        return this.request('POST', url, {
            ...{body: data},
            ...config,

        })
    }

    put(url, data = {}, config = {}) {
        return this.request('PUT', url, {
            ...{body: data},
            ...config,
        })
    }

    delete(url, data = {}, config = {}) {
        return this.request('DELETE', url, {
            ...{body: data},
            ...config,
        })
    }
}

const http = new HttpClient();

export default http;
