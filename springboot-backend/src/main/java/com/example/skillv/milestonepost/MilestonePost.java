package com.example.skillv.milestonepost;

import com.example.skillv.comment.Comment;
import com.example.skillv.template.TemplateData;
import com.example.skillv.template.TemplateType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Document("milestone_posts")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MilestonePost {
    @Id private ObjectId milestonePostId;
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
    private List<Comment> comments;
}