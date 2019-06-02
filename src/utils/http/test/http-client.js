import {HttpClient} from "../http-client";
import {InterceptorManager} from "../interceptors";
import posts from './posts'


global.fetch = require('jest-fetch-mock')


describe('HttpClient', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    test('can create', () => {
        const http = new HttpClient();
        expect(http).toBeDefined();
        expect(http.bodyParser).toBeInstanceOf(Function)
        expect(http.transformers).toBeInstanceOf(Object)
        expect(http.transformers.request).toBeInstanceOf(Array)
        expect(http.transformers.response).toBeInstanceOf(Array)
        expect(http.interceptors).toBeDefined();
        expect(http.interceptors.request).toBeDefined();
        expect(http.interceptors.request).toBeInstanceOf(InterceptorManager);
        expect(http.interceptors.response).toBeDefined();
        expect(http.interceptors.response).toBeInstanceOf(InterceptorManager);

        expect(http.defaults).toBeDefined();
    })

    test('can make GET request with JSON response', async () => {

        fetch.mockResponse(JSON.stringify(posts), {
            status: 200,
            headers: {'content-type': 'application/json'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        const data = await testApi.get("/posts");
        expect(data).toBeInstanceOf(Array);

    })

    test('can make GET request with HTML response', async () => {
        fetch.mockResponse('<h2>Hello, World</h2>', {
            status: 200,
            headers: {'content-type': 'text/html'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        const data = await testApi.get("/hello");
        expect(data).toBe('<h2>Hello, World</h2>')
    });

    test('can transform GET response', async () => {
        fetch.mockResponse('<h2>Hello, World</h2>', {
            status: 200,
            headers: {'content-type': 'text/html'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        testApi.transformers.response.push((data) => {
            return data.replace('World', 'Fred');
        });

        const data = await testApi.get("/hello");
        expect(data).toBe('<h2>Hello, Fred</h2>')
    })

    test('can use multiple transformers in GET response', async () => {
        // set up response where the data we want is deeply nested
        fetch.mockResponse(JSON.stringify({
            pager: {
                currentPage: {
                    data: posts
                }
            }
        }), {
            status: 200,
            headers: {'content-type': 'application/json'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        testApi.transformers.response.push((data) => {
            return data.pager;
        })

        testApi.transformers.response.push((data) => {
            return data.currentPage;
        })

        testApi.transformers.response.push((data) => {
            return data.data;
        })

        const data = await testApi.get("/posts");
        expect(data).toBeInstanceOf(Array)
    });

    test('can use custom Body Parser', async () => {
        fetch.mockResponse('<h2>Hello, World</h2>', {
            status: 200,
            headers: {'content-type': 'text/html'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        testApi.bodyParser = (response) => {
            return response.json();
        }

        try {
            const html = await testApi.get('/hello')
        } catch(ex) {
            expect(ex).toBeInstanceOf(Error);
        }
    })
});
