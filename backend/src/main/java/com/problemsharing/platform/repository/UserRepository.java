package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE LOWER(u.alias) = LOWER(:alias)")
    Optional<User> findByAlias(@Param("alias") String alias);

    @Query("SELECT u FROM User u WHERE LOWER(u.alias) LIKE LOWER(CONCAT('%', :keyword, '%')) AND LOWER(u.alias) NOT LIKE 'anon-%' AND LOWER(u.alias) NOT LIKE 'new_user_%'")
    List<User> searchRealUsersByAlias(@Param("keyword") String keyword);

    @Query(value = "SELECT alias FROM users WHERE LOWER(alias) LIKE LOWER(CONCAT('%', :keyword, '%')) AND LOWER(alias) NOT LIKE 'anon-%' AND LOWER(alias) NOT LIKE 'new_user_%' LIMIT 5", nativeQuery = true)
    List<String> getAliasSuggestions(@Param("keyword") String keyword);
}
