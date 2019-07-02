
global.fetch = require('jest-fetch-mock')

import { getWpRest, getWpAjax } from "../hooks";
import { HttpClient } from "../http-client";

import posts from './posts'

describe('As React Hooks', () => {
    beforeEach(() => {

        fetch.resetMocks()
    })

    test('can getWpRest to make api call', async () => {

        fetch.mockResponse(JSON.stringify(posts), {
            status: 200,
            headers: {'content-type': 'application/json'}
        });

        const http = getWpRest();
        expect(http).toBeInstanceOf(HttpClient);

        const data = await http.get('/posts');
        expect(data).toBeInstanceOf(Array);
        expect(data[0]).toBeInstanceOf(Object);

    })

    test('can getWpAjax to call ajax action', async () => {
        const expected = "<H1>Hello  World</H1>"

        fetch.mockResponse(expected, {
            status: 200,
            headers: {'content-type': 'text/html'}
        });

        const ajax = getWpAjax();

        expect(ajax).toBeInstanceOf(HttpClient)

        const html = await ajax.getAction('hello_as_html');

        expect(html).toBe(expected)
    })
});
