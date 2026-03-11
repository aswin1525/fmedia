package com.problemsharing.platform.service;

import com.problemsharing.platform.dto.UserProfileDto;
import com.problemsharing.platform.dto.UserProfileUpdateRequest;
import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.model.User;
import com.problemsharing.platform.repository.ProblemPostRepository;
import com.problemsharing.platform.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final ProblemPostRepository problemPostRepository;

    public UserService(UserRepository userRepository, ProblemPostRepository problemPostRepository) {
        this.userRepository = userRepository;
        this.problemPostRepository = problemPostRepository;
    }

    public User getOrCreateAnonymousUser(String existingAlias) {
        if (existingAlias != null && !existingAlias.isEmpty()) {
            return userRepository.findByAlias(existingAlias)
                    .orElseGet(() -> {
                        User user = new User();
                        user.setAlias(existingAlias);
                        return userRepository.save(user);
                    });
        }
        return createNewAnalogousUser();
    }

    private User createNewAnalogousUser() {
        User user = new User();
        user.setAlias("Anon-" + UUID.randomUUID().toString().substring(0, 8));
        return userRepository.save(user);
    }

    public UserProfileDto getUserProfile(String alias) {
        User user = userRepository.findByAlias(alias).orElseGet(() -> {
            User newUser = new User();
            newUser.setAlias(alias);
            return userRepository.save(newUser);
        });

        long totalPosts = problemPostRepository.countByUserAlias(alias);
        long totalUpvotes = problemPostRepository.sumUpvotesByUserAlias(alias);
        long totalReposts = problemPostRepository.sumRepostsByUserAlias(alias);

        // Calculate common tags
        List<ProblemPost> posts = problemPostRepository.findByUserAliasOrderByCreatedAtDesc(alias);
        Map<String, Long> tagCounts = new HashMap<>();
        for (ProblemPost post : posts) {
            if (post.getTags() != null) {
                for (String tag : post.getTags()) {
                    tagCounts.put(tag, tagCounts.getOrDefault(tag, 0L) + 1);
                }
            }
        }

        // Sort and limit tags
        Map<String, Long> commonTags = tagCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
                        java.util.LinkedHashMap::new));

        UserProfileDto dto = new UserProfileDto();
        dto.setUser(user);
        dto.setTotalPosts(totalPosts);
        dto.setTotalUpvotes(totalUpvotes);
        dto.setTotalReposts(totalReposts);
        dto.setCommonTags(commonTags);

        return dto;
    }

    public User updateUserProfile(String alias, UserProfileUpdateRequest request) {
        User user = userRepository.findByAlias(alias).orElseThrow(() -> new RuntimeException("User not found"));
        user.setBio(request.getBio());
        user.setProfileVisible(request.isProfileVisible());
        user.setAllowAiAnalysis(request.isAllowAiAnalysis());
        user.setCommentNotifications(request.isCommentNotifications());
        return userRepository.save(user);
    }

    public List<ProblemPost> getUserPosts(String alias) {
        return problemPostRepository.findByUserAliasOrderByCreatedAtDesc(alias);
    }
}
