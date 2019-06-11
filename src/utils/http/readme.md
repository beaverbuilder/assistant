# Assistant HTTP API

## HttpClient
This is a light, promise based wrapper around the fetch api inspired by Axios.

### Basic Usage
```javascript
const http = new HttpClient({
    baseUrl: "https://yoursite.com/api/",
    headers: {
        common: {
            'Authorization': 'Bearer ' + user.api_token
        }
    }
});

```

#### Hooks
There are a few React style hooks:
```javascript
import { useWpAjax, useWpRest } from 'utils/http'

const wpAjax = useWpAjax();
const wpRest = useWpRest();

wpAjax.getAction('update-plugin', {
    'state': {
        'appName': 'hacker-news'}
    }
);

useEffect(async () => {
    const posts = await wpRest.get('/v2/posts');
    setPosts(posts)
},[])
```
 

### Making Requests
```javascript
    
    http.get('/posts').then((posts) => {
        // ...
    })
    
        
    http.put('/posts', post).then((insertedPost) => {
        // ...    
    });
    
    http.post(`/posts/${post.id}`, post).then((updatedPost) => {
        // ...    
    })
    
    http.delete(`/posts/${post.id}`).then(() => {
        // ...
    });
    
    
```

#### Using <code>async/await</code>

```javascript
// async react hook
useEffect(async () => {
    
    let posts = await http.get('/posts');
    setPosts(posts);
    
}, []);
```

### Body Parsers

#### Default Body Parser

The default body parser looks like this:
```javascript
const defaultBodyParser = (response) => { 
    const type = response.headers.get('content-type')

    if (type.includes('text/xml') || type.includes('text/html')) {
        return response.text()
    }

    return response.json()
}
```

For the WP JSON API you could use a custom Body Parser:
```javascript
http.bodyParser = (response) => { 
    return response.json()
}
```
### Interceptors

#### Request Interceptors

#### Response Interceptors

### Transformers

#### Request Transformer

Request transformers are useful if you need to modify the config before a request is sent.

```javascript
http.transformers.request.push((request) => {
    
    // if this is a post request
   if(request.method.toLowerCase() === "post") {
       //... wrap in FormData
   } 
   
   return request;
});
```

#### Response Transformers
Response transformers help format data after the response is fulfilled
```javascript
http.transformers.response.push((data) => {
   // fix a deeply nested structure
   return data.pager.currentPage; 
});
```



