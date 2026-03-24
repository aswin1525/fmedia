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
    const trending = await fetchApi('/api/feed/trending');
    const personalized = await fetchApi('/api/feed/personalized?userAlias=test_user');
    
    console.log(`All Posts count: ${allPosts.length}`);
    console.log(`Trending count: ${trending.length}`);
    console.log(`Personalized count: ${personalized.length}`);
})();
