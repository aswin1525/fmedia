package com.problemsharing.platform.service;

import com.problemsharing.platform.dto.AuthRequest;
import com.problemsharing.platform.model.User;
import com.problemsharing.platform.repository.UserRepository;
import com.problemsharing.platform.utils.PasswordUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User signup(AuthRequest request) {
        if (userRepository.findByAlias(request.getAlias()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        User user = new User();
        user.setAlias(request.getAlias());
        user.setPasswordHash(PasswordUtil.hashPassword(request.getPassword()));
        return userRepository.save(user);
    }

    public User login(AuthRequest request) {
        User user = userRepository.findByAlias(request.getAlias())
            .orElseThrow(() -> new RuntimeException("Invalid username or password"));
        
        String hashedInput = PasswordUtil.hashPassword(request.getPassword());
        if (!hashedInput.equals(user.getPasswordHash())) {
            throw new RuntimeException("Invalid username or password");
        }
        return user;
    }
}
