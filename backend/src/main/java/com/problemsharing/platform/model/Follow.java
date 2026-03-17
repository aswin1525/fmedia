package com.problemsharing.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "follows", indexes = {
    @Index(name = "idx_follower_alias", columnList = "followerAlias"),
    @Index(name = "idx_following_alias", columnList = "followingAlias")
}, uniqueConstraints = {
    @UniqueConstraint(columnNames = {"followerAlias", "followingAlias"})
})
@Data
public class Follow {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String followerAlias; // The user who is following

    @Column(nullable = false)
    private String followingAlias; // The user being followed

    private LocalDateTime createdAt = LocalDateTime.now();
}
