(async () => {
    try {
        const response = await fetch('http://localhost:8080/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                alias: "new_user_" + Math.floor(Math.random() * 1000),
                password: "mypassword"
            })
        });
        const data = await response.json().catch(e => response.text());
        console.log("Signup status:", response.status);
        console.log("Signup data:", data);
        
        // Also try login
        const loginResponse = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                alias: data.alias,
                password: "mypassword"
            })
        });
        const loginData = await loginResponse.json().catch(e => loginResponse.text());
        console.log("Login status:", loginResponse.status);
        console.log("Login data:", loginData);
    } catch (e) {
        console.error("Signup failed:", e);
    }
})();
