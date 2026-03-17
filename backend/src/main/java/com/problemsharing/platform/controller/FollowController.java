package com.problemsharing.platform.controller;

import com.problemsharing.platform.service.FollowService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowService followService;

    public FollowController(FollowService followService) {
        this.followService = followService;
    }

    @PostMapping("/{targetAlias}")
    public ResponseEntity<?> toggleFollow(@RequestParam String currentUserAlias, @PathVariable String targetAlias) {
        try {
            boolean isFollowing = followService.toggleFollow(currentUserAlias, targetAlias);
            return ResponseEntity.ok(Map.of("following", isFollowing));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{alias}/status")
    public ResponseEntity<?> getFollowStatus(@RequestParam String currentUserAlias, @PathVariable String alias) {
        boolean isFollowing = followService.isFollowing(currentUserAlias, alias);
        return ResponseEntity.ok(Map.of("following", isFollowing));
    }

    @GetMapping("/{alias}/counts")
    public ResponseEntity<?> getFollowCounts(@PathVariable String alias) {
        return ResponseEntity.ok(followService.getFollowCounts(alias));
    }
}
