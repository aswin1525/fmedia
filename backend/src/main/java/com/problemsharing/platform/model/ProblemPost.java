package com.problemsharing.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts")
@Data
public class ProblemPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userAlias;

    @Column(columnDefinition = "TEXT")
    private String whatHappened;

    @Column(columnDefinition = "TEXT")
    private String whatTried;

    @Column(columnDefinition = "TEXT")
    private String whatWentWrong;

    @Column(columnDefinition = "TEXT")
    private String whatLearned;

    private String status;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    private int upvotes = 0;
    private int reposts = 0;
}
