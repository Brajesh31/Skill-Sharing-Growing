package com.example.skillv.enrollment;

import com.example.skillv.user.User;
import com.example.skillv.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;
//en
import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollments")
@RequiredArgsConstructor
public class EnrollmentController {

    private final UserService userService;
    private final EnrollmentService enrollmentService;

    private final EnrollmentMapper enrollmentMapper;

    // Enroll in roadmap
    @PostMapping("/{roadmap-id}/enrol")
    public ResponseEntity<EnrollmentDto> enrollInRoadmap(
            @PathVariable("roadmap-id") String roadmapId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        Enrollment enrollment = enrollmentService.enrollInRoadmap(roadmapId, userId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(enrollmentMapper.toDto(enrollment));
    }

    // Get user enrollments
    @GetMapping
    public ResponseEntity<List<EnrollmentDto>> getUserEnrollments(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        List<Enrollment> enrollments = enrollmentService.getUserEnrollments(userId);
        List<EnrollmentDto> enrollmentDtos = enrollments.stream()
                .map(enrollmentMapper::toDto)
                .toList();

        return ResponseEntity.ok(enrollmentDtos);
    }

    // Get enrollment for a specific roadmap
    @GetMapping("/{roadmap-id}/enrolment")
    public ResponseEntity<EnrollmentDto> getEnrollment(
            @PathVariable("roadmap-id") String roadmapId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        Enrollment enrollment = enrollmentService.getEnrollment(userId, roadmapId);

        return ResponseEntity.ok(enrollmentMapper.toDto(enrollment));
    }

    // Update progress
    @PutMapping("/{roadmap-id}/progress")
    public ResponseEntity<EnrollmentDto> updateProgress(
            @PathVariable("roadmap-id") String roadmapId,
            @Valid @RequestBody WeekProgressRequest progressRequest,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        Enrollment updatedEnrollment = enrollmentService.updateProgress(userId, roadmapId, progressRequest);

        return ResponseEntity.ok(enrollmentMapper.toDto(updatedEnrollment));
    }
}
