package com.problemsharing.platform.dto;

import lombok.Data;

@Data
public class UserProfileUpdateRequest {
    private String bio;
    private boolean profileVisible;
    private boolean allowAiAnalysis;
    private boolean commentNotifications;
}
