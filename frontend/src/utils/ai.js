import axios from 'axios';

export async function generateTagsAndInsights(formData) {
    try {
        const [tagsResponse, suggestionResponse] = await Promise.all([
            axios.post('http://localhost:8080/api/ai/tags', { description: formData.whatHappened }),
            axios.post('http://localhost:8080/api/ai/suggestion', { 
                whatHappened: formData.whatHappened,
                whatTried: formData.whatTried,
                whatWentWrong: formData.whatWentWrong
            })
        ]);

        return {
            tags: tagsResponse.data || [],
            insights: suggestionResponse.data?.suggestion || 'No suggestion could be generated.'
        };
    } catch (error) {
        console.error("AI API Error:", error);
        return { 
            tags: ["error", "api-failure"], 
            insights: "Could not generate insights due to an API error. Have you configured the Gemini API Key in application.properties?" 
        };
    }
}
