package com.problemsharing.platform.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Formula;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "posts", indexes = {
    @Index(name = "idx_post_user_alias", columnList = "userAlias"),
    @Index(name = "idx_post_created_at", columnList = "createdAt")
})
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

    @Formula("(select count(*) from comments c where c.post_id = id)")
    private int commentCount;
    
    // Automatically populated by JPA callbacks
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty
    private String topCommentContent;

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty
    private String topCommentUserAlias;

    @ElementCollection
    @CollectionTable(name = "post_tags", joinColumns = @JoinColumn(name = "post_id"), indexes = {
        @Index(name = "idx_post_tag", columnList = "tag")
    })
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    private int upvotes = 0;
    private int reposts = 0;

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
