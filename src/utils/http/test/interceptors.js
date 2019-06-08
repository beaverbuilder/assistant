import {Interceptor, InterceptorManager} from "../interceptors";
import posts from "./posts";
import {HttpClient} from "../http-client";

global.fetch = require('jest-fetch-mock')


describe('Interceptor', () => {
    test('can create', () => {
        const i = new Interceptor((response) => {
        }, (error) => {
        });
        expect(i).toBeDefined();
        expect(i.fulfilled).toBeInstanceOf(Function)
        expect(i.rejected).toBeInstanceOf(Function)
    })
})

describe('InterceptorManager', () => {

    test('can create', () => {
        const manager = new InterceptorManager();
        expect(manager).toBeDefined();
        expect(manager.handlers).toBeInstanceOf(Array);
        expect(manager.handlers.length).toBe(0);
    })

    test('can add Interceptor', () => {
        const manager = new InterceptorManager();
        const i = new Interceptor((response) => {
        }, (error) => {
        });
        const interceptorId = manager.use(i);

        console.log(interceptorId, 'interceptor id');

        expect(interceptorId).toBe(0);
        expect(manager.handlers.length).toBe(1);

        console.log(manager.handlers, 'handlers');
    })

    test('can eject Interceptor', () => {

        const manager = new InterceptorManager();
        const i1 = new Interceptor((response) => {
        }, (error) => {
        });
        const i2 = new Interceptor((response) => {
        }, (error) => {
        });
        const i1_id = manager.use(i1);
        const i2_id = manager.use(i2);

        expect(manager.handlers.length).toBe(2);

        manager.eject(i1_id);

        expect(manager.handlers[i1_id]).toBe(null);
        expect(manager.handlers[i2_id]).toBeInstanceOf(Interceptor);
    });

    test('response interceptor detects 401 auth error', async () => {
        fetch.mockResponse(JSON.stringify(posts), {
            status: 401,
            headers: {'content-type': 'application/json'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        console.log("Hello")

        testApi.interceptors.response.use(new Interceptor((response) => {
            console.log(response, 'response');

            expect(response.ok).toBe(true)
            expect(response.status).toBe(401)

        }, (error) => {
        }));

        try {
            const data = await testApi.get('/hello')
        } catch (ex) {
            console.log(ex, 'error');
            expect(ex).toBeInstanceOf(Error);
        }

    })

    test('request interceptor can add headers', () => {
        fetch.mockResponse(JSON.stringify(posts), {
            status: 200,
            headers: {'content-type': 'application/json'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        testApi.interceptors.request.use(
            new Interceptor(
                request => {
                    request.headers['Authorize'] = 'Bearer 123456'
                    console.log(request.headers, "set request headers");
                    return request;
                }
            )
        );

        testApi.interceptors.request.use(
            new Interceptor(
                request => {
                    console.log(request.headers, "get request headers");
                    expect(request.headers['Authorize']).toBeDefined();
                    return request;
                }
            )
        )

        const data = testApi.get('/posts');

    })
});
