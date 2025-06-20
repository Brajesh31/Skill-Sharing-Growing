package com.example.skillv.comment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
//crud
@Document
@Data
@AllArgsConstructor
@Builder
public class Comment {
    @Id
    private ObjectId commentId;
    private String authorId;
    private String authorName;
    private String content;
    private LocalDateTime timeStamp;
    private String profileImageUrl;
}
