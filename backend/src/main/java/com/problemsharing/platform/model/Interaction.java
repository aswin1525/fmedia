package com.problemsharing.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "interactions")
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
