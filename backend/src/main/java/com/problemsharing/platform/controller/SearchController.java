package com.problemsharing.platform.controller;

import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.model.User;
import com.problemsharing.platform.service.SearchService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/search")
public class SearchController {
    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/posts/tags")
    public List<ProblemPost> searchPostsByTags(@RequestParam List<String> tags) {
        return searchService.searchPostsByTags(tags);
    }

    @GetMapping("/posts/keyword")
    public List<ProblemPost> searchPostsByKeyword(@RequestParam String keyword) {
        return searchService.searchPostsByKeyword(keyword);
    }

    @GetMapping("/users")
    public List<User> searchUsers(@RequestParam String keyword) {
        return searchService.searchUsers(keyword);
    }
}
