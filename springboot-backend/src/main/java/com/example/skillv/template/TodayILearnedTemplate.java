package com.example.skillv.template;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@Builder
public class TodayILearnedTemplate implements TemplateData {
    private String title;
    private String topicSkill;
    private String whatLearned;
    private ArrayList<String> resourceUsed;
    private String nextStep;
}