package com.example.skillv.enrollment;


import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class EnrollmentMapper {

    public EnrollmentDto toDto(Enrollment enrollment) {
        return EnrollmentDto.builder()
                .id(enrollment.getId().toHexString())
                .userId(enrollment.getUserId())
                .roadmapId(enrollment.getRoadmapId().toHexString())
                .enrolledAt(enrollment.getEnrolledAt())
                .progress(mapProgressToDto(enrollment.getProgress()))
                .build();
    }

    private List<WeekProgressDto> mapProgressToDto(List<Enrollment.WeekProgress> progress) {
        return progress.stream()
                .map(this::mapProgressItemToDto)
                .collect(Collectors.toList());
    }

    private WeekProgressDto mapProgressItemToDto(Enrollment.WeekProgress progress) {
        return WeekProgressDto.builder()
                .week(progress.getWeek())
                .completed(progress.isCompleted())
                .build();
    }

    public Enrollment.WeekProgress toWeekProgressEntity(WeekProgressRequest request) {
        return Enrollment.WeekProgress.builder()
                .week(request.getWeek())
                .completed(request.isCompleted())
                .build();
    }
}