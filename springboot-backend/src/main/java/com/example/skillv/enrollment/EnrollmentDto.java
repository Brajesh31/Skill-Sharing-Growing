package com.example.skillv.enrollment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EnrollmentDto {
    private String id;
    private String userId;
    private String roadmapId;
    private LocalDateTime enrolledAt;
    private List<WeekProgressDto> progress;
}
