package com.problemsharing.platform.controller;

import com.problemsharing.platform.dto.AuthRequest;
import com.problemsharing.platform.model.User;
import com.problemsharing.platform.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.problemsharing.platform.security.JwtUtil;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AuthRequest request) {
        try {
            User user = authService.signup(request);
            String token = jwtUtil.generateToken(user.getAlias());
            return ResponseEntity.ok(new com.problemsharing.platform.dto.AuthResponse(token, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            User user = authService.login(request);
            String token = jwtUtil.generateToken(user.getAlias());
            return ResponseEntity.ok(new com.problemsharing.platform.dto.AuthResponse(token, user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
