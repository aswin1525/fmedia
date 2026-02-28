package com.problemsharing.platform.controller;

import com.problemsharing.platform.model.User;
import com.problemsharing.platform.service.UserService;
import org.springframework.web.bind.annotation.*;

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
}
