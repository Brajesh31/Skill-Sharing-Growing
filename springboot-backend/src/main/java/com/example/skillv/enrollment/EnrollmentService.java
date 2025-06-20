package com.example.skillv.enrollment;

import com.example.skillv.exception.ResourceNotFoundException;
import com.example.skillv.roadmap.Roadmap;
import com.example.skillv.roadmap.RoadmapService;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentService {
    private final RoadmapService roadmapService;
    private final EnrollmentRepository enrollmentRepository;

    // Enrollment operations
    public Enrollment enrollInRoadmap(String roadmapId, String userId) {
        ObjectId roadmapObjectId = new ObjectId(roadmapId);

        // Check if already enrolled
        if (enrollmentRepository.existsByUserIdAndRoadmapId(userId, roadmapObjectId)) {
            throw new RuntimeException("User is already enrolled in this roadmap");
        }

        // Get roadmap to create progress for each week
        Roadmap roadmap = roadmapService.getRoadmapById(roadmapId);

        // Create progress items
        List<Enrollment.WeekProgress> progress = roadmap.getWeeks().stream()
                .map(week -> Enrollment.WeekProgress.builder()
                        .week(week.getWeekNumber())
                        .completed(false)
                        .build())
                .collect(Collectors.toList());

        // Create enrollment
        Enrollment enrollment = Enrollment.builder()
                .userId(userId)
                .roadmapId(roadmapObjectId)
                .enrolledAt(LocalDateTime.now())
                .progress(progress)
                .build();

        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getUserEnrollments(String userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public boolean isUserEnrolled(String userId, String roadmapId) {
        return enrollmentRepository.existsByUserIdAndRoadmapId(userId, new ObjectId(roadmapId));
    }

    public Enrollment updateProgress(String userId, String roadmapId, WeekProgressRequest progressRequest) {
        ObjectId roadmapObjectId = new ObjectId(roadmapId);

        Enrollment enrollment = enrollmentRepository.findByUserIdAndRoadmapId(userId, roadmapObjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for user: " + userId + " and roadmap: " + roadmapId));

        // Find and update the week progress
        enrollment.getProgress().stream()
                .filter(p -> p.getWeek() == progressRequest.getWeek())
                .findFirst()
                .ifPresent(p -> p.setCompleted(progressRequest.isCompleted()));

        return enrollmentRepository.save(enrollment);
    }

    public Enrollment getEnrollment(String userId, String roadmapId) {
        return enrollmentRepository.findByUserIdAndRoadmapId(userId, new ObjectId(roadmapId))
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found for user: " + userId + " and roadmap: " + roadmapId));
    }

    public void deleteEnrollmentsByRoadmapId(String roadmapId){
        ObjectId roadmapObjectId = new ObjectId(roadmapId);
        enrollmentRepository.deleteByRoadmapId(roadmapObjectId);
    }
}
