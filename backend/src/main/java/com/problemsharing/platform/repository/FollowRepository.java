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
    List<Follow> findByFollowingAliasOrderByCreatedAtDesc(String followingAlias);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Follow f SET f.followerAlias = :newAlias WHERE f.followerAlias = :oldAlias")
    void updateFollowerAlias(@org.springframework.data.repository.query.Param("oldAlias") String oldAlias, @org.springframework.data.repository.query.Param("newAlias") String newAlias);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Follow f SET f.followingAlias = :newAlias WHERE f.followingAlias = :oldAlias")
    void updateFollowingAlias(@org.springframework.data.repository.query.Param("oldAlias") String oldAlias, @org.springframework.data.repository.query.Param("newAlias") String newAlias);
}
