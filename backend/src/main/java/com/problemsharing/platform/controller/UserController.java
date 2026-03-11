package com.problemsharing.platform.controller;

import com.problemsharing.platform.dto.UserProfileDto;
import com.problemsharing.platform.dto.UserProfileUpdateRequest;
import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.model.User;
import com.problemsharing.platform.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/init")
    public User initUser(@RequestParam(required = false) String alias) {
        return userService.getOrCreateAnonymousUser(alias);
    }

    @GetMapping("/{alias}/profile")
    public UserProfileDto getUserProfile(@PathVariable String alias) {
        return userService.getUserProfile(alias);
    }

    @PutMapping("/{alias}/profile")
    public User updateUserProfile(@PathVariable String alias, @RequestBody UserProfileUpdateRequest request) {
        return userService.updateUserProfile(alias, request);
    }

    @GetMapping("/{alias}/posts")
    public List<ProblemPost> getUserPosts(@PathVariable String alias) {
        return userService.getUserPosts(alias);
    }
}
