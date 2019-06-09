import {HttpClient} from "../index";
import posts from './posts'

global.fetch = require('jest-fetch-mock')


describe('Request and Response Transformers', () => {
    beforeEach(() => {
        fetch.resetMocks()
    })

    test('can transform request', async () =>  {

        fetch.mockResponse(JSON.stringify(posts), {
            status: 200,
            headers: {'content-type': 'application/json'}
        });

        const http = new HttpClient({
            baseUrl: 'http://mysite.fake'
        });

        let transformerRan = false;
        http.transformers.request.push((body) => {
            transformerRan = true;
            return body;

        })

        await http.put('/posts', posts[0]);

        expect(transformerRan).toBe(true);

    })

    test('can transform response', async () => {

        fetch.mockResponse(JSON.stringify(posts), {
            status: 200,
            headers: {'content-type': 'application/json'}
        });

        const http = new HttpClient({
            baseUrl: 'http://mysite.fake'
        });

        let transformerRan = false;
        http.transformers.response.push((data) => {
            transformerRan = true;
            return data;
        })

        await http.get('/posts');

        expect(transformerRan).toBe(true);
    });

    test('can transform GET response', async () => {
        fetch.mockResponse('<h2>Hello, World</h2>', {
            status: 200,
            headers: {'content-type': 'text/html'}
        });

        const http = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        http.transformers.response.push((data) => {
            return data.replace('World', 'Fred');
        });

        const data = await http.get("/hello");
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

        const http = new HttpClient({
            baseUrl: "https://mockapi.fake"
        });

        http.transformers.response.push((data) => {
            return data.pager;
        })

        http.transformers.response.push((data) => {
            return data.currentPage;
        })

        http.transformers.response.push((data) => {
            return data.data;
        })

        const data = await http.get("/posts");
        expect(data).toBeInstanceOf(Array)
    });
})
