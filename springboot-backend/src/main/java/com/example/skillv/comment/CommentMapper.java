package com.example.skillv.comment;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class CommentMapper {
    public Comment toEntity(CommentRequest request) {
        return Comment
                .builder()
                .content(request.getContent())
                .timeStamp(LocalDateTime.now())
                .build();
    }

    public CommentDto toDto(Comment entity) {
        return new CommentDto(
                entity.getCommentId() != null ? entity.getCommentId().toHexString() : null,
                entity.getAuthorId(),
                entity.getAuthorName(),
                entity.getContent(),
                entity.getTimeStamp(),
                entity.getProfileImageUrl()
        );
    }
}
