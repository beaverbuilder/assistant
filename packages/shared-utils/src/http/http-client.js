import defaults from './defaults'
import {InterceptorManager} from "./interceptors";
import {addQueryArgs, isAbsoluteURL} from "../url";
import {merge} from 'lodash'

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

        this.defaults = {
            ...defaults,
            ...config
        };
    }

    _transformRequest(body) {
        this.transformers.request.forEach((transformer) => {
            body = transformer(body)
        })
        return body;
    }

    _transformResponse(data) {
        this.transformers.response.forEach((transformer) => {
            data = transformer(data);
        })
        return data;
    }

    _interceptRequest(request) {
        this.interceptors.request.handlers.forEach((interceptor) => {
            try {
                request = interceptor.fulfilled(request)
            } catch (ex) {
                interceptor.rejected(ex);
            }
        })
        return request;
    }

    _interceptResponse(response) {
        this.interceptors.response.handlers.forEach((interceptor) => {
            try {
                response = interceptor.fulfilled(response)
            } catch (ex) {
                interceptor.rejected(ex);
            }
        });
        return response;
    }

    request(method, url, config = {}) {
        config = {
            ...this.defaults,
            ...config
        }

        const methodHeaders = this.defaults.headers[method.toLowerCase()]

        const headers = {
            ...this.defaults.headers.common,
            ...methodHeaders
        }

        // if the passed url is a relative path, append it to the baseUrl
        if (config.baseUrl && !isAbsoluteURL(url)) {
            url = config.baseUrl + url;
        }

        // construct the basic request
        let request = {
            method,
            headers
        };

        if (config.hasOwnProperty('credentials')) {
            request.credentials = config.credentials;
        }

        // run request interceptors
        request = this._interceptRequest(request);

        // fetch cancels requests and returns an error
        // when GET/HEAD requests contain a body property
        if ('GET' !== method && 'HEAD' !== method) {
            // run request transformers
            request.body = this._transformRequest(config.body);
        }

        return fetch(url, request)
            .then((response) => {
                // run response interceptors
                response = this._interceptResponse(response);

                if (!response.ok) {
                    throw new Error(response.status + ":" + response.statusText);
                }

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
        //console.log(data, 'request data');
        return this.request('POST', url, {
            body: data,
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
