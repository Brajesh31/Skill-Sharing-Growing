package com.example.skillv.skillpost;

import com.example.skillv.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class SkillPostMapper {
    private final CommentMapper commentMapper;

    public SkillPost toEntity(SkillPostRequest request) {
        return SkillPost.builder()
                .skillName(request.getSkillName())
                .title(request.getTitle())
                .description(request.getDescription())
                .skillPostImageUrls(request.getSkillPostImageUrls() != null ? request.getSkillPostImageUrls() : new ArrayList<>())
                .skillPostVideoUrl(request.getSkillPostVideoUrl())
                .skillPostVideoThumbnailUrl(request.getSkillPostVideoThumbnailUrl() != null ? request.getSkillPostVideoThumbnailUrl() : null)
                .videoDurationSeconds(request.getVideoDurationSeconds())
                .createdAt(LocalDateTime.now())
                .noOfLikes(0)
                .likedUserIds(new HashSet<>())
                .comments(new ArrayList<>())
                .build();
    }

    public SkillPostDto toDto(SkillPost entity) {
        return new SkillPostDto(
                entity.getSkillPostId() != null ? entity.getSkillPostId().toHexString() : null,
                entity.getAuthorId(),
                entity.getAuthorName(),
                entity.getAuthorProfileImageUrl(),
                entity.getSkillPostImageUrls(),
                entity.getSkillPostVideoUrl(),
                entity.getSkillPostVideoThumbnailUrl(),
                entity.getVideoDurationSeconds(),
                entity.getSkillName(),
                entity.getTitle(),
                entity.getDescription(),
                entity.getNoOfLikes(),
                entity.getLikedUserIds(),
                entity.getComments().stream().map(commentMapper::toDto).toList(),
                entity.getCreatedAt()
        );
    }

    public void updateEntityFromRequest(SkillPostRequest request, SkillPost entity) {
        entity.setSkillName(request.getSkillName());
        entity.setTitle(request.getTitle());
        entity.setDescription(request.getDescription());
        entity.setSkillPostImageUrls(request.getSkillPostImageUrls());
        entity.setSkillPostVideoUrl(request.getSkillPostVideoUrl());
        entity.setVideoDurationSeconds(request.getVideoDurationSeconds());
    }
}