package com.problemsharing.platform.controller;

import com.problemsharing.platform.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public Map<String, Object> getDashboardStats(@org.springframework.web.bind.annotation.RequestParam(required = false) String userAlias) {
        return analyticsService.getDashboardStats(userAlias);
    }
}
