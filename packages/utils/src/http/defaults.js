const formHeaders = {
    'Content-Type': 'application/json'
}

export default {
    baseUrl: false,
    credentials: 'same-origin',
    body: null,
    headers: {
        common: {
            'Accept': 'application/json, text/plain, */*'
        },
        get: {},
        head: {},
        post: formHeaders,
        put: formHeaders,
        patch: formHeaders,
        delete: {},
    },
}


