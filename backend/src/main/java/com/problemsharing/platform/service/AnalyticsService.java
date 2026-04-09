package com.problemsharing.platform.service;

import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.repository.ProblemPostRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@Service
public class AnalyticsService {
    private final ProblemPostRepository postRepository;
    private final com.problemsharing.platform.repository.InteractionRepository interactionRepository;
    private final com.problemsharing.platform.repository.CommentRepository commentRepository;
    private final com.problemsharing.platform.repository.FollowRepository followRepository;

    public AnalyticsService(ProblemPostRepository postRepository,
                            com.problemsharing.platform.repository.InteractionRepository interactionRepository,
                            com.problemsharing.platform.repository.CommentRepository commentRepository,
                            com.problemsharing.platform.repository.FollowRepository followRepository) {
        this.postRepository = postRepository;
        this.interactionRepository = interactionRepository;
        this.commentRepository = commentRepository;
        this.followRepository = followRepository;
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
        long totalLikes = 0;
        long totalComments = 0;

        for (ProblemPost post : posts) {
            if (post.getTags() != null) {
                for (String tag : post.getTags()) {
                    tagCounts.put(tag, tagCounts.getOrDefault(tag, 0) + 1);
                }
            }
            totalLikes += interactionRepository.countByPostIdAndType(post.getId(), com.problemsharing.platform.model.Interaction.InteractionType.UPVOTE);
            totalComments += commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId()).size();
        }

        List<NotificationDto> notifications = new ArrayList<>();

        long newFollowers = 0;
        if (userAlias != null && !userAlias.isEmpty()) {
            newFollowers = followRepository.countByFollowingAlias(userAlias);

            List<Long> postIds = posts.stream().map(ProblemPost::getId).toList();

            if (!postIds.isEmpty()) {
                List<com.problemsharing.platform.model.Interaction> interactions = interactionRepository.findByPostIdInOrderByCreatedAtDesc(postIds);
                for (com.problemsharing.platform.model.Interaction i : interactions) {
                    if (i.getUserAlias().equals(userAlias)) continue;
                    String message = i.getType() == com.problemsharing.platform.model.Interaction.InteractionType.UPVOTE ? "upvoted your post" : "reposted your post";
                    notifications.add(new NotificationDto(i.getType().name(), i.getUserAlias(), message, i.getCreatedAt()));
                }

                List<com.problemsharing.platform.model.Comment> comments = commentRepository.findByPostIdInOrderByCreatedAtDesc(postIds);
                for (com.problemsharing.platform.model.Comment c : comments) {
                    if (c.getUserAlias().equals(userAlias)) continue;
                    notifications.add(new NotificationDto("COMMENT", c.getUserAlias(), "commented on your post: \"" + c.getContent() + "\"", c.getCreatedAt()));
                }
            }

            List<com.problemsharing.platform.model.Follow> follows = followRepository.findByFollowingAliasOrderByCreatedAtDesc(userAlias);
            for (com.problemsharing.platform.model.Follow f : follows) {
                if (f.getFollowerAlias().equals(userAlias)) continue;
                notifications.add(new NotificationDto("FOLLOW", f.getFollowerAlias(), "started following you", f.getCreatedAt()));
            }

            notifications.sort((n1, n2) -> n2.getCreatedAt().compareTo(n1.getCreatedAt()));
            if (notifications.size() > 20) {
                notifications = notifications.subList(0, 20);
            }
        }

        // sort and limit tagCounts to top 5
        Map<String, Integer> topTags = tagCounts.entrySet().stream()
            .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
            .limit(5)
            .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1, java.util.LinkedHashMap::new));

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPosts", totalPosts);
        stats.put("totalSolved", totalSolved);
        stats.put("tagCounts", topTags);
        stats.put("totalLikes", totalLikes);
        stats.put("totalComments", totalComments);
        stats.put("newFollowers", newFollowers);
        stats.put("notifications", notifications);

        return stats;
    }

    public static class NotificationDto {
        public String type;
        public String userAlias;
        public String message;
        public java.time.LocalDateTime createdAt;

        public NotificationDto(String type, String userAlias, String message, java.time.LocalDateTime createdAt) {
            this.type = type;
            this.userAlias = userAlias;
            this.message = message;
            this.createdAt = createdAt;
        }

        public String getType() { return type; }
        public String getUserAlias() { return userAlias; }
        public String getMessage() { return message; }
        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    }
}
