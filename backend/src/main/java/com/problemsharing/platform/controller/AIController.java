package com.problemsharing.platform.controller;

import com.problemsharing.platform.service.AIGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIGenerationService aiGenerationService;

    @Autowired
    public AIController(AIGenerationService aiGenerationService) {
        this.aiGenerationService = aiGenerationService;
    }

    @PostMapping("/tags")
    public ResponseEntity<List<String>> generateTags(@RequestBody Map<String, String> request) {
        try {
            String description = request.getOrDefault("description", "");
            if (description.isEmpty()) {
                return ResponseEntity.badRequest().body(List.of("Problem description is required for tags"));
            }
            
            List<String> tags = aiGenerationService.generateTags(description);
            return ResponseEntity.ok(tags);
        } catch (Throwable t) {
            return ResponseEntity.ok(List.of("ERROR: " + t.getClass().getName() + " - " + t.getMessage()));
        }
    }

    @PostMapping("/suggestion")
    public ResponseEntity<Map<String, String>> generateSuggestion(@RequestBody Map<String, String> request) {
        String whatHappened = request.getOrDefault("whatHappened", "");
        String whatTried = request.getOrDefault("whatTried", "");
        String whatWentWrong = request.getOrDefault("whatWentWrong", "");

        if (whatHappened.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "'What Happened' is required to generate a suggestion."));
        }

        String suggestion = aiGenerationService.generateSuggestion(whatHappened, whatTried, whatWentWrong);
        return ResponseEntity.ok(Map.of("suggestion", suggestion));
    }

    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzePost(@RequestBody Map<String, String> request) {
        String whatHappened = request.getOrDefault("whatHappened", "");
        String whatTried = request.getOrDefault("whatTried", "");
        String whatWentWrong = request.getOrDefault("whatWentWrong", "");

        if (whatHappened.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "'What Happened' is required to generate insights."));
        }

        Map<String, Object> result = aiGenerationService.generateTagsAndSuggestion(whatHappened, whatTried, whatWentWrong);
        return ResponseEntity.ok(result);
    }
}
