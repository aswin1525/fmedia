package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.ProblemPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProblemPostRepository extends JpaRepository<ProblemPost, Long> {
    @Query("SELECT DISTINCT p FROM ProblemPost p LEFT JOIN FETCH p.tags ORDER BY p.createdAt DESC")
    List<ProblemPost> findAllByOrderByCreatedAtDesc();

    @Query("SELECT DISTINCT p FROM ProblemPost p LEFT JOIN FETCH p.tags ORDER BY p.upvotes DESC, p.reposts DESC, p.createdAt DESC")
    List<ProblemPost> findAllTrending();

    @Query("SELECT DISTINCT p FROM ProblemPost p LEFT JOIN FETCH p.tags WHERE p.userAlias IN :aliases ORDER BY p.createdAt DESC")
    List<ProblemPost> findByUserAliasesOrderByCreatedAtDesc(@Param("aliases") List<String> aliases);

    @Query("SELECT DISTINCT p FROM ProblemPost p JOIN p.tags t WHERE LOWER(t) IN :tags ORDER BY p.createdAt DESC")
    List<ProblemPost> findByTagsInOrderByCreatedAtDesc(@Param("tags") List<String> tags);

    @Query("SELECT DISTINCT p FROM ProblemPost p LEFT JOIN FETCH p.tags WHERE " +
           "LOWER(p.whatHappened) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.whatTried) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.whatWentWrong) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.whatLearned) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY p.createdAt DESC")
    List<ProblemPost> searchByKeyword(@Param("keyword") String keyword);

    @Query("SELECT DISTINCT p FROM ProblemPost p LEFT JOIN FETCH p.tags WHERE LOWER(p.userAlias) = LOWER(:userAlias) ORDER BY p.createdAt DESC")
    List<ProblemPost> findByUserAliasOrderByCreatedAtDesc(@Param("userAlias") String userAlias);

    @Query("SELECT COUNT(p) FROM ProblemPost p WHERE LOWER(p.userAlias) = LOWER(:alias)")
    long countByUserAlias(@Param("alias") String alias);

    @Query("SELECT COALESCE(SUM(p.upvotes), 0) FROM ProblemPost p WHERE LOWER(p.userAlias) = LOWER(:alias)")
    long sumUpvotesByUserAlias(@Param("alias") String alias);

    @Query("SELECT COALESCE(SUM(p.reposts), 0) FROM ProblemPost p WHERE LOWER(p.userAlias) = LOWER(:alias)")
    long sumRepostsByUserAlias(@Param("alias") String alias);

    @Modifying
    @Query("UPDATE ProblemPost p SET p.userAlias = :newAlias WHERE p.userAlias = :oldAlias")
    void updateUserAlias(@Param("oldAlias") String oldAlias, @Param("newAlias") String newAlias);
}
