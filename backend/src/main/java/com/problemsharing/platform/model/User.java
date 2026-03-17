package com.problemsharing.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_alias", columnList = "alias")
})
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String alias; // Anonymous alias

    private String passwordHash; // Added for authentication


    @Column(columnDefinition = "TEXT")
    private String bio;

    // Privacy Settings
    private boolean profileVisible = true;
    private boolean allowAiAnalysis = true;
    private boolean commentNotifications = true;

    private LocalDateTime createdAt = LocalDateTime.now();
}
