package com.problemsharing.platform.service;

import com.problemsharing.platform.model.Follow;
import com.problemsharing.platform.repository.FollowRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.Optional;

@Service
public class FollowService {

    private final FollowRepository followRepository;

    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    @Transactional
    public boolean toggleFollow(String followerAlias, String followingAlias) {
        if (followerAlias.equals(followingAlias)) {
            throw new RuntimeException("Cannot follow yourself");
        }
        Optional<Follow> existingFollow = followRepository.findByFollowerAliasAndFollowingAlias(followerAlias, followingAlias);
        if (existingFollow.isPresent()) {
            followRepository.delete(existingFollow.get());
            return false;
        } else {
            Follow follow = new Follow();
            follow.setFollowerAlias(followerAlias);
            follow.setFollowingAlias(followingAlias);
            followRepository.save(follow);
            return true;
        }
    }

    public boolean isFollowing(String followerAlias, String followingAlias) {
        return followRepository.existsByFollowerAliasAndFollowingAlias(followerAlias, followingAlias);
    }

    public Map<String, Long> getFollowCounts(String alias) {
        long followingCount = followRepository.countByFollowerAlias(alias);
        long followersCount = followRepository.countByFollowingAlias(alias);
        return Map.of("following", followingCount, "followers", followersCount);
    }
}
