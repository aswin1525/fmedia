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
    public User updateUserProfile(@PathVariable String alias, @RequestParam String currentUserAlias, @RequestBody UserProfileUpdateRequest request) {
        if (!alias.equals(currentUserAlias)) {
            throw new RuntimeException("Unauthorized: You can only edit your own profile.");
        }
        return userService.updateUserProfile(alias, request);
    }

    @PutMapping("/{oldAlias}/alias")
    public User changeUserAlias(@PathVariable String oldAlias, @RequestParam String newAlias, @RequestParam String currentUserAlias) {
        if (!oldAlias.equals(currentUserAlias)) {
            throw new RuntimeException("Unauthorized: You can only change your own alias.");
        }
        return userService.changeUserAlias(oldAlias, newAlias);
    }

    @GetMapping("/{alias}/posts")
    public List<ProblemPost> getUserPosts(@PathVariable String alias) {
        return userService.getUserPosts(alias);
    }
}
