package com.example.skillv.roadmap;

import com.example.skillv.comment.Comment;
import com.example.skillv.comment.CommentMapper;
import com.example.skillv.comment.CommentRequest;
import com.example.skillv.enrollment.EnrollmentService;
import com.example.skillv.notification.NotificationDto;
import com.example.skillv.notification.NotificationMapper;
import com.example.skillv.notification.NotificationService;
import com.example.skillv.notification.NotificationType;
import com.example.skillv.user.User;
import com.example.skillv.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final EnrollmentService enrollmentService;
    private final RoadmapMapper roadmapMapper;
    private final CommentMapper commentMapper;
    private final NotificationMapper notificationMapper;

    // Create a new roadmap
    @PostMapping
    public ResponseEntity<RoadmapDto> createRoadmap(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal,
            @Valid @RequestBody RoadmapRequest request
    ) {
        // Get user details
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);

        // Create roadmap entity
        Roadmap roadmap = roadmapMapper.toEntity(request);
        roadmap.setAuthorId(user.getId().toHexString());
        roadmap.setAuthorName(principal.getName());
        roadmap.setAuthorImg(user.getProfileImageUrl());

        // Save roadmap
        Roadmap savedRoadmap = roadmapService.createRoadmap(roadmap);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(roadmapMapper.toDto(savedRoadmap, user.getId().toHexString()));
    }

    // Get all roadmaps
    @GetMapping
    public ResponseEntity<List<RoadmapDto>> getAllRoadmaps(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        List<Roadmap> roadmaps = roadmapService.getAllRoadmaps();
        List<RoadmapDto> roadmapDtos = roadmaps.stream()
                .map(roadmap -> {
                    RoadmapDto dto = roadmapMapper.toDto(roadmap, userId);
                    dto.setUserEnrolled(roadmapService.isUserEnrolled(userId, roadmap.getId().toHexString()));
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(roadmapDtos);
    }

    // Get roadmap by ID
    @GetMapping("/{roadmap-id}")
    public ResponseEntity<RoadmapDto> getRoadmapById(
            @PathVariable("roadmap-id") String roadmapId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        Roadmap roadmap = roadmapService.getRoadmapById(roadmapId);

        // Increment view count
        roadmapService.incrementViewCount(roadmapId);

        RoadmapDto dto = roadmapMapper.toDto(roadmap, userId);
        dto.setUserEnrolled(roadmapService.isUserEnrolled(userId, roadmapId));

        return ResponseEntity.ok(dto);
    }

    // Update roadmap
    @PutMapping("/{roadmap-id}")
    public ResponseEntity<RoadmapDto> updateRoadmap(
            @PathVariable("roadmap-id") String roadmapId,
            @Valid @RequestBody RoadmapRequest request,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        // Get user details
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        // Check if the user is the author
        Roadmap existingRoadmap = roadmapService.getRoadmapById(roadmapId);
        if (!existingRoadmap.getAuthorId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Update roadmap
        roadmapMapper.updateEntityFromRequest(request, existingRoadmap);
        Roadmap updatedRoadmap = roadmapService.updateRoadmap(existingRoadmap);

        return ResponseEntity.ok(roadmapMapper.toDto(updatedRoadmap, userId));
    }

    // Delete roadmap
    @DeleteMapping("/{roadmap-id}")
    public ResponseEntity<Void> deleteRoadmap(
            @PathVariable("roadmap-id") String roadmapId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        // Get user details
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        // Check if the user is the author
        Roadmap existingRoadmap = roadmapService.getRoadmapById(roadmapId);
        if (!existingRoadmap.getAuthorId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Delete roadmap enrollments before deleting roadmap
        enrollmentService.deleteEnrollmentsByRoadmapId(roadmapId);

        // Delete roadmap
        roadmapService.deleteRoadmap(roadmapId);

        return ResponseEntity.noContent().build();
    }

    // Like roadmap
    @PostMapping("/{roadmap-id}/like")
    public ResponseEntity<RoadmapDto> likeRoadmap(
            @PathVariable("roadmap-id") String roadmapId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        Roadmap roadmap = roadmapService.addLike(roadmapId, userId);

        //Add Notification
        String notificationText = " liked your " + "'" + roadmap.getTitle() + "'" + " roadmap.";
        NotificationDto notificationDto = new NotificationDto(
                null,
                roadmap.getAuthorId(),
                user.getName(),
                roadmap.getId().toHexString(),
                NotificationType.LIKE,
                notificationText,
                LocalDateTime.now(),
                false
        );

        notificationService.create(notificationMapper.toEntity(notificationDto));

        return ResponseEntity.ok(roadmapMapper.toDto(roadmap, userId));
    }

    // Unlike roadmap
    @DeleteMapping("/{roadmap-id}/like")
    public ResponseEntity<RoadmapDto> unlikeRoadmap(
            @PathVariable("roadmap-id") String roadmapId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        Roadmap roadmap = roadmapService.removeLike(roadmapId, userId);

        return ResponseEntity.ok(roadmapMapper.toDto(roadmap, userId));
    }

    // Add comment to roadmap
    @PostMapping("/{roadmap-id}/comments")
    public ResponseEntity<RoadmapDto> addComment(
            @PathVariable("roadmap-id") String roadmapId,
            @Valid @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        Comment comment = commentMapper.toEntity(commentRequest);
        comment.setCommentId(new ObjectId());
        comment.setAuthorId(userId);
        comment.setAuthorName(principal.getName());
        comment.setProfileImageUrl(user.getProfileImageUrl());
        Roadmap roadmap = roadmapService.addComment(roadmapId, comment);

        //Add Notification
        String notificationText = " commented on your " + "'" + roadmap.getTitle() + "'" + " roadmap.";
        NotificationDto notificationDto = new NotificationDto(
                null,
                roadmap.getAuthorId(),
                user.getName(),
                roadmap.getId().toHexString(),
                NotificationType.COMMENT,
                notificationText,
                LocalDateTime.now(),
                false
        );

        notificationService.create(notificationMapper.toEntity(notificationDto));

        return ResponseEntity.ok(roadmapMapper.toDto(roadmap, userId));
    }

    // Update comment
    @PutMapping("/{roadmap-id}/comments/{comment-id}")
    public ResponseEntity<RoadmapDto> updateComment(
            @PathVariable("roadmap-id") String roadmapId,
            @PathVariable("comment-id") String commentId,
            @Valid @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        // Verify that the user is the author of the comment (you would need to implement this check)
        Roadmap roadmap = roadmapService.getRoadmapById(roadmapId);
        boolean isCommentAuthor = roadmap.getComments().stream()
                .anyMatch(c -> c.getCommentId().equals(new ObjectId(commentId)) && c.getAuthorId().equals(userId));

        if (!isCommentAuthor) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Roadmap updatedRoadmap = roadmapService.updateComment(roadmapId, commentId, commentRequest.getContent());

        return ResponseEntity.ok(roadmapMapper.toDto(updatedRoadmap, userId));
    }

    // Delete comment
    @DeleteMapping("/{roadmap-id}/comments/{comment-id}")
    public ResponseEntity<RoadmapDto> deleteComment(
            @PathVariable("roadmap-id") String roadmapId,
            @PathVariable("comment-id") String commentId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        // Verify that the user is the author of the comment or the roadmap
        Roadmap roadmap = roadmapService.getRoadmapById(roadmapId);
        boolean isCommentAuthor = roadmap.getComments().stream()
                .anyMatch(c -> c.getCommentId().equals(new ObjectId(commentId)) && c.getAuthorId().equals(userId));
        boolean isRoadmapAuthor = roadmap.getAuthorId().equals(userId);

        if (!isCommentAuthor && !isRoadmapAuthor) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Roadmap updatedRoadmap = roadmapService.deleteComment(roadmapId, commentId);

        return ResponseEntity.ok(roadmapMapper.toDto(updatedRoadmap, userId));
    }

    // Get roadmaps by category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<RoadmapDto>> getRoadmapsByCategory(
            @PathVariable String category,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        List<Roadmap> roadmaps = roadmapService.getRoadmapsByCategory(category);
        List<RoadmapDto> roadmapDtos = roadmaps.stream()
                .map(roadmap -> {
                    RoadmapDto dto = roadmapMapper.toDto(roadmap, userId);
                    dto.setUserEnrolled(roadmapService.isUserEnrolled(userId, roadmap.getId().toHexString()));
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(roadmapDtos);
    }

    // Get roadmaps by tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<RoadmapDto>> getRoadmapsByTag(
            @PathVariable String tag,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        List<Roadmap> roadmaps = roadmapService.getRoadmapsByTag(tag);
        List<RoadmapDto> roadmapDtos = roadmaps.stream()
                .map(roadmap -> {
                    RoadmapDto dto = roadmapMapper.toDto(roadmap, userId);
                    dto.setUserEnrolled(roadmapService.isUserEnrolled(userId, roadmap.getId().toHexString()));
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(roadmapDtos);
    }

    // Get roadmaps by author
    @GetMapping("/author/{author-id}")
    public ResponseEntity<List<RoadmapDto>> getRoadmapsByAuthor(
            @PathVariable("author-id") String authorId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        List<Roadmap> roadmaps = roadmapService.getRoadmapsByAuthor(authorId);
        List<RoadmapDto> roadmapDtos = roadmaps.stream()
                .map(roadmap -> {
                    RoadmapDto dto = roadmapMapper.toDto(roadmap, userId);
                    dto.setUserEnrolled(roadmapService.isUserEnrolled(userId, roadmap.getId().toHexString()));
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(roadmapDtos);
    }

    // Get liked roadmaps
    @GetMapping("/liked")
    public ResponseEntity<List<RoadmapDto>> getLikedRoadmaps(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toHexString();

        List<Roadmap> roadmaps = roadmapService.getLikedRoadmaps(userId);
        List<RoadmapDto> roadmapDtos = roadmaps.stream()
                .map(roadmap -> {
                    RoadmapDto dto = roadmapMapper.toDto(roadmap, userId);
                    dto.setUserEnrolled(roadmapService.isUserEnrolled(userId, roadmap.getId().toHexString()));
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(roadmapDtos);
    }
}