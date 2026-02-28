package com.problemsharing.platform.service;

import com.problemsharing.platform.model.User;
import com.problemsharing.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getOrCreateAnonymousUser(String existingAlias) {
        if (existingAlias != null && !existingAlias.isEmpty()) {
            return userRepository.findByAlias(existingAlias)
                    .orElseGet(this::createNewAnalogousUser);
        }
        return createNewAnalogousUser();
    }

    private User createNewAnalogousUser() {
        User user = new User();
        user.setAlias("Anon-" + UUID.randomUUID().toString().substring(0, 8));
        return userRepository.save(user);
    }
}
