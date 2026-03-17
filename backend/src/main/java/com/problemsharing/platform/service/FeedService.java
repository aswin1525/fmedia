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

    public FeedService(ProblemPostRepository postRepository, FollowRepository followRepository) {
        this.postRepository = postRepository;
        this.followRepository = followRepository;
    }

    public List<ProblemPost> getPersonalizedFeed(String userAlias) {
        List<Follow> following = followRepository.findByFollowerAlias(userAlias);
        if (following.isEmpty()) {
            return postRepository.findAllTrending(); // fallback to trending
        }
        List<String> followingAliases = following.stream().map(Follow::getFollowingAlias).toList();
        return postRepository.findByUserAliasesOrderByCreatedAtDesc(followingAliases);
    }

    public List<ProblemPost> getTrendingFeed() {
        return postRepository.findAllTrending();
    }
}
