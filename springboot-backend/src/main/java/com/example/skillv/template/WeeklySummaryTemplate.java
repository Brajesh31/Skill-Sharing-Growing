package com.example.skillv.template;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class WeeklySummaryTemplate implements TemplateData {
    private String title;
    private String workedOn;
    private String highlights;
    private String challenge;
    private String nextFocus;
    private String progress;
}