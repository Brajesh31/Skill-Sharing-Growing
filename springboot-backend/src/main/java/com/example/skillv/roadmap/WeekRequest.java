package com.example.skillv.roadmap;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
class WeekRequest {
    private int weekNumber;

    @NotBlank(message = "Week title is required")
    private String title;

    @NotBlank(message = "Week content is required")
    private String content;
}
