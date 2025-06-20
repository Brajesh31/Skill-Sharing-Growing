package com.example.skillv.milestonepost;

import com.example.skillv.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
public class MilestonePostMapper {
    private final CommentMapper commentMapper;

    public MilestonePost toEntity(MilestonePostRequest request) {
        return MilestonePost.builder()
                .skill(request.getSkill())
                .title(request.getTitle())
                .templateType(request.getTemplateType())
                .templateData(request.getTemplateData())
                .postedDate(LocalDateTime.now())
                .noOfLikes(0)
                .likedUserIds(new HashSet<>())
                .comments(new ArrayList<>())
                .build();
    }

    public MilestonePostDto toDto(MilestonePost entity) {
        return new MilestonePostDto(
                entity.getMilestonePostId() != null ? entity.getMilestonePostId().toHexString() : null,
                entity.getAuthorId(),
                entity.getAuthorName(),
                entity.getPostedDate(),
                entity.getProfileImageUrl(),
                entity.getSkill(),
                entity.getTitle(),
                entity.getTemplateType(),
                entity.getTemplateData(),
                entity.getLikedUserIds(),
                entity.getNoOfLikes(),
                entity.getComments().stream().map(commentMapper::toDto).toList()
        );
    }

    public void updateEntityFromRequest(MilestonePostRequest request, MilestonePost entity) {
        entity.setSkill(request.getSkill());
        entity.setTitle(request.getTitle());
        entity.setTemplateType(request.getTemplateType());
        entity.setTemplateData(request.getTemplateData());
    }
}