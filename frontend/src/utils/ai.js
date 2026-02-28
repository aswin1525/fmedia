import axios from 'axios';

export async function generateTagsAndInsights(postText) {
    const apiKey = localStorage.getItem('aiApiKey');
    const endpoint = localStorage.getItem('aiApiEndpoint') || 'https://api.openai.com/v1/chat/completions';
    const model = localStorage.getItem('aiApiModel') || 'gpt-3.5-turbo';

    if (!apiKey) {
        console.warn("No AI API Key found. Returning mock data.");
        return {
            tags: ["failure", "learning", "tech"],
            insights: "Mock AI Insight: It seems like a common issue. Document your steps clearly next time and don't give up!"
        };
    }

    try {
        const response = await axios.post(endpoint, {
            model: model,
            messages: [
                { role: 'system', content: 'You are an AI assistant that analyzes failure stories. Extract 3-5 relevant hashtags and provide a 2 sentence practical recommendation on what to do next or how to avoid this.' },
                { role: 'user', content: postText }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const reply = response.data.choices[0].message.content;

        // Naive parsing: find words starting with #
        const tagsMatches = reply.match(/#[\w-]+/g) || [];
        const tags = tagsMatches.map(t => t.replace('#', ''));

        // The rest is insight
        const insights = reply.replace(/#[\w-]+/g, '').trim();

        return { tags, insights };
    } catch (error) {
        console.error("AI API Error:", error);
        return { tags: ["error"], insights: "Could not generate insights due to an API error. Check your API key and endpoint in the Profile tab." };
    }
}
