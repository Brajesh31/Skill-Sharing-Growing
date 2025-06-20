package com.example.skillv.milestonepost;

import com.example.skillv.comment.Comment;
import com.example.skillv.comment.CommentMapper;
import com.example.skillv.comment.CommentRequest;
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
@RequestMapping("/api/v1/milestone-posts")
@RequiredArgsConstructor
public class MilestonePostController {

    private final MilestonePostService milestonePostService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final MilestonePostMapper milestonePostMapper;
    private final CommentMapper commentMapper;
    private final NotificationMapper notificationMapper;

    @PostMapping
    public ResponseEntity<MilestonePostDto> saveMilestonePost(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal,
            @Valid @RequestBody MilestonePostRequest request
    ) {
        // Convert request to entity
        MilestonePost milestonePost = milestonePostMapper.toEntity(request);

        // Set author details
        String googleId = principal.getAttributes().get("sub").toString();
        var user = userService.findByGoogleId(googleId);

        milestonePost.setAuthorId(user.getId().toString());
        milestonePost.setProfileImageUrl(user.getProfileImageUrl());
        milestonePost.setAuthorName(principal.getName());

        // Save and convert to DTO
        MilestonePost savedPost = milestonePostService.save(milestonePost);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(milestonePostMapper.toDto(savedPost));
    }

    @GetMapping
    public ResponseEntity<List<MilestonePostDto>> getAllMilestonePosts() {
        List<MilestonePost> allMilestonePosts = milestonePostService.findAll();
        List<MilestonePostDto> dtos = allMilestonePosts.stream()
                .map(milestonePostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{milestone-post-id}")
    public ResponseEntity<MilestonePostDto> getMilestonePostById(
            @PathVariable("milestone-post-id") String milestonePostId) {
        MilestonePost milestonePost = milestonePostService.findById(milestonePostId);
        return ResponseEntity.ok(milestonePostMapper.toDto(milestonePost));
    }

    @PutMapping("/{milestone-post-id}")
    public ResponseEntity<MilestonePostDto> updateMilestonePost(
            @PathVariable("milestone-post-id") String milestonePostId,
            @Valid @RequestBody MilestonePostRequest request,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        // Get existing post
        MilestonePost existingPost = milestonePostService.findById(milestonePostId);

        // Check if user is the author
        String googleId = principal.getAttributes().get("sub").toString();
        String userId = userService.findByGoogleId(googleId)
                .getId()
                .toString();

        if (!existingPost.getAuthorId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Update fields while preserving metadata
        milestonePostMapper.updateEntityFromRequest(request, existingPost);

        // Save and return
        MilestonePost updatedPost = milestonePostService.update(existingPost);
        return ResponseEntity.ok(milestonePostMapper.toDto(updatedPost));
    }

    @DeleteMapping("/{milestone-post-id}")
    public ResponseEntity<Void> deleteMilestonePostById(
            @PathVariable("milestone-post-id") String milestonePostId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        // Get existing post
        MilestonePost existingPost = milestonePostService.findById(milestonePostId);

        // Check if user is the author
        String googleId = principal.getAttributes().get("sub").toString();
        String userId = userService.findByGoogleId(googleId)
                .getId()
                .toString();

        if (!existingPost.getAuthorId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        milestonePostService.delete(milestonePostId);
        return ResponseEntity.noContent().build();
    }

    // Social interaction endpoints

    @PostMapping("/{milestone-post-id}/like")
    public ResponseEntity<MilestonePostDto> likeMilestonePost(
            @PathVariable("milestone-post-id") String milestonePostId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);
        String userId = user.getId().toString();

        MilestonePost updatedPost = milestonePostService.addLike(milestonePostId, userId, user.getName());

        return ResponseEntity.ok(milestonePostMapper.toDto(updatedPost));
    }

    @DeleteMapping("/{milestone-post-id}/like")
    public ResponseEntity<MilestonePostDto> unlikeMilestonePost(
            @PathVariable("milestone-post-id") String milestonePostId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        String userId = userService.findByGoogleId(googleId)
                .getId()
                .toString();

        MilestonePost updatedPost = milestonePostService.removeLike(milestonePostId, userId);
        return ResponseEntity.ok(milestonePostMapper.toDto(updatedPost));
    }

    @PostMapping("/{milestone-post-id}/comments")
    public ResponseEntity<MilestonePostDto> addComment(
            @PathVariable("milestone-post-id") String milestonePostId,
            @Valid @RequestBody CommentRequest commentRequest,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        MilestonePost post = milestonePostService.findById(milestonePostId);

        // Set comment metadata
        String googleId = principal.getAttributes().get("sub").toString();
        var user = userService.findByGoogleId(googleId);

        Comment comment = commentMapper.toEntity(commentRequest);

        comment.setCommentId(new ObjectId());
        comment.setAuthorId(user.getId().toString());
        comment.setAuthorName(principal.getName());
        comment.setProfileImageUrl(user.getProfileImageUrl());

        // Add comment to post
        post.getComments().add(comment);
        MilestonePost updatedPost = milestonePostService.update(post);
        //Add Notification
        String notificationText = " commented on your " + "'" + post.getTitle() + "'" + " milestone post.";
        NotificationDto notificationDto = new NotificationDto(
                null,
                post.getAuthorId(),
                user.getName(),
                post.getMilestonePostId().toHexString(),
                NotificationType.COMMENT,
                notificationText,
                LocalDateTime.now(),
                false
        );

        notificationService.create(notificationMapper.toEntity(notificationDto));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(milestonePostMapper.toDto(updatedPost));
    }

    @DeleteMapping("/{milestone-post-id}/comments/{comment-id}")
    public ResponseEntity<MilestonePostDto> deleteComment(
            @PathVariable("milestone-post-id") String milestonePostId,
            @PathVariable("comment-id") String commentId,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        MilestonePost post = milestonePostService.findById(milestonePostId);

        // Get user ID
        String googleId = principal.getAttributes().get("sub").toString();
        String userId = userService.findByGoogleId(googleId)
                .getId()
                .toString();
        ObjectId commentObjectId = new ObjectId(commentId);

        // Find comment
        Comment commentToDelete = post.getComments().stream()
                .filter(c -> c.getCommentId().equals(commentObjectId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check if user is either comment author or post owner
        if (!commentToDelete.getAuthorId().equals(userId) && !post.getAuthorId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        // Remove comment
        post.getComments().removeIf(c -> c.getCommentId().equals(commentObjectId));
        MilestonePost updatedPost = milestonePostService.update(post);

        return ResponseEntity.ok(milestonePostMapper.toDto(updatedPost));
    }

    @PutMapping("/{milestone-post-id}/comments/{comment-id}")
    public ResponseEntity<MilestonePostDto> updateComment(
            @PathVariable("milestone-post-id") String milestonePostId,
            @PathVariable("comment-id") String commentId,
            @Valid @RequestBody CommentRequest updatedCommentRequest,
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        MilestonePost post = milestonePostService.findById(milestonePostId);

        // Get user ID
        String googleId = principal.getAttributes().get("sub").toString();
        String userId = userService.findByGoogleId(googleId)
                .getId()
                .toString();

        ObjectId commentObjectId = new ObjectId(commentId);

        // Find comment
        Comment existingComment = post.getComments().stream()
                .filter(c -> c.getCommentId().equals(commentObjectId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        // Check if user is comment author
        if (!existingComment.getAuthorId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Comment updatedComment = commentMapper.toEntity(updatedCommentRequest);

        // Update only the content, preserve metadata
        existingComment.setContent(updatedComment.getContent());

        MilestonePost updatedPost = milestonePostService.update(post);

        return ResponseEntity.ok(milestonePostMapper.toDto(updatedPost));
    }

    @GetMapping("/user/{user-id}")
    public ResponseEntity<List<MilestonePostDto>> getPostsByUser(
            @PathVariable("user-id") String userId) {
        List<MilestonePost> posts = milestonePostService.findByUserId(userId);
        List<MilestonePostDto> postDtos = posts.stream()
                .map(milestonePostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/me")
    public ResponseEntity<List<MilestonePostDto>> getCurrentUserPosts(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal) {

        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);

        List<MilestonePost> posts = milestonePostService.findByUserId(user.getId().toHexString());
        List<MilestonePostDto> postDtos = posts.stream()
                .map(milestonePostMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/feed")
    public ResponseEntity<List<MilestonePostDto>> getFeed(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal) {

        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);

        // Get IDs of users that the current user follows
        List<String> followingIds = user.getFollowing().stream()
                .map(ObjectId::toHexString)
                .collect(Collectors.toList());

        List<MilestonePost> posts = milestonePostService.getFeedForUser(
                user.getId().toHexString(), followingIds);

        List<MilestonePostDto> postDtos = posts.stream()
                .map(milestonePostMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(postDtos);
    }

    @GetMapping("/liked")
    public ResponseEntity<List<MilestonePostDto>> getLikedPosts(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal) {

        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);

        List<MilestonePost> posts = milestonePostService.findLikedByUser(user.getId().toHexString());
        List<MilestonePostDto> postDtos = posts.stream()
                .map(milestonePostMapper::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(postDtos);
    }
}