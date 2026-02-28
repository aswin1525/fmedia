package com.problemsharing.platform.repository;

import com.problemsharing.platform.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    Optional<Interaction> findByPostIdAndUserAliasAndType(Long postId, String userAlias,
            Interaction.InteractionType type);

    long countByPostIdAndType(Long postId, Interaction.InteractionType type);
}
