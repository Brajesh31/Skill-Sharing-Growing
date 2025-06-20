package com.example.skillv.milestonepost;

import com.example.skillv.comment.CommentDto;
import com.example.skillv.template.TemplateData;
import com.example.skillv.template.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
public class MilestonePostDto {
    private String milestonePostId;
    private String authorId;
    private String authorName;
    private LocalDateTime postedDate;
    private String profileImageUrl;
    private String skill;
    private String title;
    private TemplateType templateType;
    private TemplateData templateData;
    private Set<String> likedUserIds;
    private int noOfLikes;
    private List<CommentDto> comments;
}
