import defaults from '../defaults'

describe('HttpClient defaults', () => {
    test('default common header has Accept', () => {
        expect(defaults.headers.common).toHaveProperty('Accept');
    })

    test('default common Accept header accepts json, text, and wildcard', () => {
        expect(defaults.headers.common['Accept']).toMatch(/application\/json/);
        expect(defaults.headers.common['Accept']).toMatch(/text\/plain/);
        expect(defaults.headers.common['Accept']).toMatch(/\*\/\*/);
    })

    test('default headers contains all methods', ()=> {
        expect(defaults.headers).toHaveProperty('common');
        expect(defaults.headers).toHaveProperty('get');
        expect(defaults.headers).toHaveProperty('post');
        expect(defaults.headers).toHaveProperty('put');
        expect(defaults.headers).toHaveProperty('patch');
        expect(defaults.headers).toHaveProperty('head');
        expect(defaults.headers).toHaveProperty('delete');
    })

    test('default post/put/patch to have content type', () => {
        expect(defaults.headers.post).toHaveProperty('Content-Type');
        expect(defaults.headers.put).toHaveProperty('Content-Type');
        expect(defaults.headers.patch).toHaveProperty('Content-Type');

    })

    test('default post/put/patch content type to be json', () => {
        expect(defaults.headers.post['Content-Type']).toMatch(/application\/json/);
        expect(defaults.headers.put['Content-Type']).toMatch(/application\/json/);
        expect(defaults.headers.patch['Content-Type']).toMatch(/application\/json/);
    })
})
