const axios = require('axios');

(async () => {
    const payload = {
        whatHappened: "I tried to post",
        whatTried: "clicking submit",
        whatWentWrong: "it didn't save",
        whatLearned: "nothing yet",
        status: "ONGOING",
        userAlias: "test_user",
        tags: ["failure", "learning"]
    };

    try {
        const res = await axios.post('http://localhost:8080/api/posts', payload);
        console.log("Success:", res.data);
    } catch (e) {
        console.error("Error:", e.response ? e.response.data : e.message);
    }
})();
