import {HttpClient, Interceptor, InterceptorManager} from "../index";
import posts from "./posts";

global.fetch = require('jest-fetch-mock')


describe('InterceptorManager', () => {

    test('can create', () => {
        const manager = new InterceptorManager();
        expect(manager).toBeDefined();
        expect(manager.handlers).toBeInstanceOf(Array);
        expect(manager.handlers.length).toBe(0);
    })

    test('can add interceptor', () => {
        const manager = new InterceptorManager();

        const interceptorId = manager.use(
            (response) => {
            },
            (error) => {
            }
        );

        expect(interceptorId).toBe(0);
        expect(manager.handlers.length).toBe(1);
    })

    test('can eject interceptor', () => {

        const manager = new InterceptorManager();

        const i1_id = manager.use(
            (response) => {
            },
            (error) => {
            }
        );
        const i2_id = manager.use(
            (response) => {
            },
            (error) => {
            }
        );

        expect(manager.handlers.length).toBe(2);

        manager.eject(i1_id);

        expect(manager.handlers[i1_id]).toBe(null);
        expect(manager.handlers[i2_id]).toBeInstanceOf(Object);
    });

    test('response interceptor detects 401 auth error', async () => {
        fetch.mockResponse(JSON.stringify(posts), {
            status: 401,
            headers: {'content-type': 'application/json'}
        });

        const testApi = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });


        testApi.interceptors.response.use(
            (response) => {
                expect(response.ok).toBe(true)
                expect(response.status).toBe(401)

            },
            (error) => {
            });

        try {
            const data = await testApi.get('/hello')
        } catch (ex) {
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
            request => {
                request.headers['Authorize'] = 'Bearer 123456'
                return request;
            },
            error => {
            }
        );

        testApi.interceptors.request.use(
            request => {
                expect(request.headers['Authorize']).toBeDefined();
                return request;
            },
            error => {
            }
        )

        const data = testApi.get('/posts');

    })
});
