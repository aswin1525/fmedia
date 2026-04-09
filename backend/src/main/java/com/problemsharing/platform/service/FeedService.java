package com.problemsharing.platform.service;

import com.problemsharing.platform.model.Follow;
import com.problemsharing.platform.model.ProblemPost;
import com.problemsharing.platform.repository.FollowRepository;
import com.problemsharing.platform.repository.ProblemPostRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FeedService {
    private final ProblemPostRepository postRepository;
    private final FollowRepository followRepository;
    private final com.problemsharing.platform.repository.CommentRepository commentRepository;

    public FeedService(ProblemPostRepository postRepository, FollowRepository followRepository, com.problemsharing.platform.repository.CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.followRepository = followRepository;
        this.commentRepository = commentRepository;
    }

    private List<ProblemPost> enrichWithTopComment(List<ProblemPost> posts) {
        for (ProblemPost post : posts) {
            List<com.problemsharing.platform.model.Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(post.getId());
            if (!comments.isEmpty()) {
                post.setTopCommentContent(comments.get(0).getContent());
                post.setTopCommentUserAlias(comments.get(0).getUserAlias());
            }
        }
        return posts;
    }

    public List<ProblemPost> getPersonalizedFeed(String userAlias) {
        List<Follow> following = followRepository.findByFollowerAlias(userAlias);
        if (following.isEmpty()) {
            return enrichWithTopComment(postRepository.findAllByOrderByCreatedAtDesc()); // default to latest
        }
        List<String> followingAliases = following.stream().map(Follow::getFollowingAlias).toList();
        List<ProblemPost> posts = postRepository.findByUserAliasesOrderByCreatedAtDesc(followingAliases);
        if (posts.isEmpty()) {
            return enrichWithTopComment(postRepository.findAllByOrderByCreatedAtDesc()); // fallback to latest
        }
        return enrichWithTopComment(posts);
    }

    public List<ProblemPost> getTrendingFeed() {
        return enrichWithTopComment(postRepository.findAllTrending());
    }

    public List<ProblemPost> getLatestFeed() {
        return enrichWithTopComment(postRepository.findAllByOrderByCreatedAtDesc());
    }
}
