const http = require('http');

function fetchApi(path) {
    return new Promise((resolve) => {
        http.get('http://localhost:8080' + path, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        });
    });
}

(async () => {
    const allPosts = await fetchApi('/api/posts');
    console.log("Latest post:", JSON.stringify(allPosts[0], null, 2));
})();
