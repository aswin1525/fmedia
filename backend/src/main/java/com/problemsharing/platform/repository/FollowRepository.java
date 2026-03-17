package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface FollowRepository extends JpaRepository<Follow, Long> {
    Optional<Follow> findByFollowerAliasAndFollowingAlias(String followerAlias, String followingAlias);
    long countByFollowerAlias(String followerAlias);
    long countByFollowingAlias(String followingAlias);
    boolean existsByFollowerAliasAndFollowingAlias(String followerAlias, String followingAlias);
    List<Follow> findByFollowerAlias(String followerAlias);
}
