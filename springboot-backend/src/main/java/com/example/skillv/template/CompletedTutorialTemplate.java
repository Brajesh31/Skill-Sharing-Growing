package com.example.skillv.template;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CompletedTutorialTemplate implements TemplateData {
    private String title;
    private String tutorialName;
    private String platform;
    private String duration;
    private String skillsGained;
    private String achievement;
    private String demoLink;
    private String difficulty;
    private String recommendation;
    private String recommendationReason;
}
//dd