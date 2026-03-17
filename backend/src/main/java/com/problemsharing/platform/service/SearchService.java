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
        return postRepository.findByTagsInOrderByCreatedAtDesc(tags.stream().map(String::toLowerCase).toList());
    }

    public List<ProblemPost> searchPostsByKeyword(String keyword) {
        return postRepository.searchByKeyword(keyword);
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.searchByAliasContainingIgnoreCase(keyword);
    }
}
