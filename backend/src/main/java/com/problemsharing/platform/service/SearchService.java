package com.problemsharing.platform.service;

import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.model.User;
import com.problemsharing.platform.repository.ProblemPostRepository;
import com.problemsharing.platform.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SearchService {
    private final ProblemPostRepository postRepository;
    private final UserRepository userRepository;

    public SearchService(ProblemPostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public List<ProblemPost> searchPostsByTags(List<String> tags) {
        if (tags == null || tags.isEmpty()) return List.of();
        
        // Flatten any comma-separated tags and clean them
        List<String> flattenedTags = tags.stream()
                .flatMap(t -> java.util.Arrays.stream(t.split(",")))
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .map(String::toLowerCase)
                .toList();
                
        return postRepository.findByTagsInOrderByCreatedAtDesc(flattenedTags);
    }

    public List<ProblemPost> searchPostsByKeyword(String keyword) {
        return postRepository.searchByKeyword(keyword);
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.searchRealUsersByAlias(keyword);
    }

    public List<String> getSuggestions(String keyword) {
        if (keyword == null || keyword.trim().length() < 2) return List.of();
        String cleanKeyword = keyword.trim().toLowerCase();
        
        // Fetch matching aliases
        return userRepository.getAliasSuggestions(cleanKeyword);
    }
}
