package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.ProblemPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProblemPostRepository extends JpaRepository<ProblemPost, Long> {
    List<ProblemPost> findAllByOrderByCreatedAtDesc();
}
