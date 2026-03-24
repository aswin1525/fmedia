package com.problemsharing.platform.service;

import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.repository.ProblemPostRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    private final ProblemPostRepository postRepository;

    public AnalyticsService(ProblemPostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Map<String, Object> getDashboardStats(String userAlias) {
        List<ProblemPost> posts;
        if (userAlias != null && !userAlias.isEmpty()) {
            posts = postRepository.findByUserAliasOrderByCreatedAtDesc(userAlias);
        } else {
            posts = postRepository.findAll();
        }
        long totalPosts = posts.size();
        long totalSolved = posts.stream().filter(p -> "SOLVED".equalsIgnoreCase(p.getStatus())).count();

        Map<String, Integer> tagCounts = new HashMap<>();
        for (ProblemPost post : posts) {
            if (post.getTags() != null) {
                for (String tag : post.getTags()) {
                    tagCounts.put(tag, tagCounts.getOrDefault(tag, 0) + 1);
                }
            }
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", totalPosts);
        stats.put("totalSolved", totalSolved);
        stats.put("tagCounts", tagCounts);

        return stats;
    }
}
