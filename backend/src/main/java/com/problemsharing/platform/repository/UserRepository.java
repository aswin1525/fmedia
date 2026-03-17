package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByAlias(String alias);

    @Query("SELECT u FROM User u WHERE LOWER(u.alias) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> searchByAliasContainingIgnoreCase(@Param("keyword") String keyword);
}
