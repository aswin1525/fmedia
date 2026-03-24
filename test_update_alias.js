const axios = require('axios');

(async () => {
    try {
        // Init a user
        await axios.get('http://localhost:8080/api/users/test_user/profile');
        
        // Concurrent update Profile and Alias
        console.log("Sending concurrent requests for profile and alias...");
        const p1 = axios.put('http://localhost:8080/api/users/test_user/profile', { bio: "updated bio" });
        const p2 = axios.put('http://localhost:8080/api/users/test_user/alias?newAlias=test_user_2');
        
        const results = await Promise.allSettled([p1, p2]);
        console.log("Profile update result:", results[0].status, results[0].status === 'rejected' ? results[0].reason?.response?.data || results[0].reason?.message : 'OK');
        console.log("Alias update result:", results[1].status, results[1].status === 'rejected' ? results[1].reason?.response?.data || results[1].reason?.message : 'OK');
        
        // Check finding newAlias profile
        const profileResponse = await axios.get('http://localhost:8080/api/users/test_user_2/profile');
        console.log("Fetched new profile bio:", profileResponse.data.user.bio);
    } catch (e) {
        console.error(e.response ? e.response.data : e.message);
    }
})();
