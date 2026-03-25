package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Comment c SET c.userAlias = :newAlias WHERE c.userAlias = :oldAlias")
    void updateUserAlias(String oldAlias, String newAlias);

    List<Comment> findByPostIdInOrderByCreatedAtDesc(List<Long> postIds);
}
