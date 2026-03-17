package com.problemsharing.platform.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String alias;
    private String password;
}
