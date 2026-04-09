package com.problemsharing.platform.controller;

import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.service.FeedService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/feed")
public class FeedController {
    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping("/personalized")
    public List<ProblemPost> getPersonalizedFeed(@RequestParam String userAlias) {
        return feedService.getPersonalizedFeed(userAlias);
    }

    @GetMapping("/trending")
    public List<ProblemPost> getTrendingFeed() {
        return feedService.getTrendingFeed();
    }

    @GetMapping("/latest")
    public List<ProblemPost> getLatestFeed() {
        return feedService.getLatestFeed();
    }
}
