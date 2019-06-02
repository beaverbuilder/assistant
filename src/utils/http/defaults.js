const formHeaders = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

export default {
    baseUrl: false,
    credentials: null,
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


