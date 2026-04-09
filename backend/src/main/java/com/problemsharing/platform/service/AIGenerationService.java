package com.problemsharing.platform.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AIGenerationService {

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.api.model}")
    private String apiModel;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIGenerationService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public List<String> generateTags(String problemDescription) {
        if (apiKey == null || apiKey.equals("YOUR_API_KEY_HERE") || apiKey.isEmpty()) {
            return List.of("API Key Not Configured");
        }

        String prompt = "You are a developer assistant. Extract up to 5 simple, lowercase, highly relevant tags from the following problem description. Examples: react, javascript, debugging, nullpointerexception, css. Return ONLY the tags as a comma-separated list without quotes or additional text.\n\nDescription: " + problemDescription;
        String rawResponse = callAI(prompt);
        
        if ("ERROR_RATE_LIMIT".equals(rawResponse)) {
            return List.of("api-quota-exceeded");
        } else if ("ERROR_API_FAILED".equals(rawResponse)) {
            return List.of("api-error");
        }

        List<String> tags = new ArrayList<>();
        if (rawResponse != null && !rawResponse.trim().isEmpty()) {
            String[] split = rawResponse.split(",");
            for (String s : split) {
                String clean = s.trim().toLowerCase().replaceAll("[^a-z0-9-]", "");
                if (!clean.isEmpty()) {
                    tags.add(clean);
                }
            }
        }
        return tags;
    }

    public String generateSuggestion(String whatHappened, String whatTried, String whatWentWrong) {
        if (apiKey == null || apiKey.equals("YOUR_API_KEY_HERE") || apiKey.isEmpty()) {
            return "Please configure your AI API Key in the backend application.properties file to receive AI suggestions.";
        }

        String prompt = String.format(
            "You are a helpful software engineering mentor. A user has encountered a problem.\n" +
            "What Happened: %s\n" +
            "What they tried: %s\n" +
            "What went wrong/Error: %s\n\n" +
            "Provide a concise, helpful suggestion on what they should check or try next. Keep it under 3 sentences and friendly.",
            whatHappened, whatTried, whatWentWrong
        );

        String rawResponse = callAI(prompt);
        if ("ERROR_RATE_LIMIT".equals(rawResponse)) {
            return "Our AI assistant is currently receiving too many requests or has hit its daily quota limit. Please try again later or check your Google Cloud Console billing.";
        } else if ("ERROR_API_FAILED".equals(rawResponse)) {
            return "Failed to connect to the AI Service. Please check if your API key is correct and valid.";
        }
        
        return rawResponse;
    }

    public Map<String, Object> generateTagsAndSuggestion(String whatHappened, String whatTried, String whatWentWrong) {
        if (apiKey == null || apiKey.equals("YOUR_API_KEY_HERE") || apiKey.isEmpty()) {
            return Map.of("tags", List.of("API Key Not Configured"), "suggestion", "Please configure your AI API Key in the backend application.properties file to receive AI suggestions.");
        }

        String prompt = String.format(
            "You are a helpful software engineering mentor. A user has encountered a problem.\n" +
            "What Happened: %s\n" +
            "What they tried: %s\n" +
            "What went wrong/Error: %s\n\n" +
            "1. Extract up to 5 simple, lowercase, highly relevant tags.\n" +
            "2. Provide a concise, helpful suggestion on what they should check or try next (under 3 sentences, friendly).\n" +
            "You MUST output ONLY a valid JSON object without markdown formatting, with keys 'tags' (array of strings) and 'suggestion' (string).",
            whatHappened, whatTried, whatWentWrong
        );

        String rawResponse = callAI(prompt);
        if ("ERROR_RATE_LIMIT".equals(rawResponse)) {
            return Map.of("tags", List.of("api-quota-exceeded"), "suggestion", "Our AI assistant is currently receiving too many requests or has hit its daily quota limit.");
        } else if ("ERROR_API_FAILED".equals(rawResponse)) {
            return Map.of("tags", List.of("api-error"), "suggestion", "Failed to connect to the AI Service. Please check if your API key is correct and valid.");
        }
        
        try {
            String cleanJson = rawResponse;
            if (cleanJson.startsWith("```json")) cleanJson = cleanJson.substring(7);
            if (cleanJson.startsWith("```")) cleanJson = cleanJson.substring(3);
            if (cleanJson.endsWith("```")) cleanJson = cleanJson.substring(0, cleanJson.length() - 3);

            JsonNode responseJson = objectMapper.readTree(cleanJson.trim());
            List<String> tags = new ArrayList<>();
            if (responseJson.has("tags") && responseJson.get("tags").isArray()) {
                 for (JsonNode t : responseJson.get("tags")) {
                     String clean = t.asText().trim().toLowerCase().replaceAll("[^a-z0-9-]", "");
                     if (!clean.isEmpty()) tags.add(clean);
                 }
            }
            String suggestion = responseJson.has("suggestion") ? responseJson.get("suggestion").asText() : "Could not generate a suggestion.";
            return Map.of("tags", tags, "suggestion", suggestion);
        } catch (Exception e) {
            return Map.of("tags", List.of("ai-parse-error"), "suggestion", "We generated insights but couldn't format them properly. Check AI configuration.");
        }
    }

    private String callAI(String prompt) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            // Construct payload: { "model": "...", "messages": [{"role": "user", "content": prompt}] }
            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", apiModel);
            requestBody.put("messages", List.of(message));

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, request, String.class);
            
            // Parse response (OpenAI format): choices -> [0] -> message -> content
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode choicesNode = rootNode.path("choices");
            if (choicesNode.isArray() && !choicesNode.isEmpty()) {
                JsonNode firstChoice = choicesNode.get(0);
                JsonNode messageNode = firstChoice.path("message");
                if (!messageNode.isMissingNode() && messageNode.has("content")) {
                    return messageNode.path("content").asText();
                }
            }
            return "Could not generate response.";
        } catch (Exception e) {
            System.err.println("AI API call failed: " + e.getMessage());
            e.printStackTrace();
            String errorMsg = e.getMessage() != null ? e.getMessage() : "";
            if (errorMsg.contains("429") || errorMsg.contains("Too Many Requests") || errorMsg.contains("Quota exceeded")) {
                return "ERROR_RATE_LIMIT";
            }
            return "ERROR_API_FAILED";
        }
    }
}
