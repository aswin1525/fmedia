package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.ProblemPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProblemPostRepository extends JpaRepository<ProblemPost, Long> {
    List<ProblemPost> findAllByOrderByCreatedAtDesc();

    List<ProblemPost> findByUserAliasOrderByCreatedAtDesc(String userAlias);

    @Query("SELECT COUNT(p) FROM ProblemPost p WHERE p.userAlias = :alias")
    long countByUserAlias(@Param("alias") String alias);

    @Query("SELECT COALESCE(SUM(p.upvotes), 0) FROM ProblemPost p WHERE p.userAlias = :alias")
    long sumUpvotesByUserAlias(@Param("alias") String alias);

    @Query("SELECT COALESCE(SUM(p.reposts), 0) FROM ProblemPost p WHERE p.userAlias = :alias")
    long sumRepostsByUserAlias(@Param("alias") String alias);
}
