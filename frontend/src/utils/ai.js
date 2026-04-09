import axios from 'axios';

export async function generateTagsAndInsights(formData) {
    try {
        const response = await axios.post('/api/ai/analyze', { 
            whatHappened: formData.whatHappened,
            whatTried: formData.whatTried,
            whatWentWrong: formData.whatWentWrong
        });

        return {
            tags: response.data.tags || [],
            insights: response.data.suggestion || 'No suggestion could be generated.'
        };
    } catch (error) {
        console.error("AI API Error:", error);
        return { 
            tags: ["error", "api-failure"], 
            insights: "Could not generate insights due to an API error. Have you configured the Gemini API Key in application.properties?" 
        };
    }
}
