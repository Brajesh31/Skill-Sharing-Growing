package com.example.skillv.template;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
//comment
@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type"
)
@JsonSubTypes({
        @JsonSubTypes.Type(value = TodayILearnedTemplate.class, name = "TODAY_I_LEARNED"),
        @JsonSubTypes.Type(value = CompletedTutorialTemplate.class, name = "COMPLETED_A_TUTORIAL"),
        @JsonSubTypes.Type(value = WeeklySummaryTemplate.class, name = "WEEKLY_SUMMARY")
})
public interface TemplateData {
}