package com.problemsharing.platform.dto;

import com.problemsharing.platform.model.User;
import lombok.Data;
import java.util.Map;

@Data
public class UserProfileDto {
    private User user;
    private long totalPosts;
    private long totalUpvotes;
    private long totalReposts;
    private Map<String, Long> commonTags;
}
