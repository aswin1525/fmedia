package com.problemsharing.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "interactions", 
    indexes = {
        @Index(name = "idx_interaction_post_user_type", columnList = "post_id, userAlias, type")
    },
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"post_id", "userAlias", "type"})
    }
)
@Data
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private ProblemPost post;

    @Column(nullable = false)
    private String userAlias;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InteractionType type;

    private LocalDateTime createdAt = LocalDateTime.now();

    public enum InteractionType {
        UPVOTE, REPOST
    }
}
