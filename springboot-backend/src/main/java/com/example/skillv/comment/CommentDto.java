package com.example.skillv.comment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    private String commentId;
    private String authorId;
    private String authorName;
    private String content;
    private LocalDateTime timestamp;
    private String profileImageUrl;
}
