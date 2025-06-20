package com.example.skillv.roadmap;

import com.example.skillv.comment.CommentDto;
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
public class RoadmapDto {
    private String id;
    private String title;
    private String description;
    private String category;
    private String authorId;
    private String authorName;
    private String authorImg;
    private LocalDateTime publishedDate;
    private int totalView;
    private List<WeekDto> weeks;
    private List<String> tags;
    private List<CommentDto> comments;
    private int noOfLikes;
    private boolean userLiked;
    private boolean userEnrolled;
}