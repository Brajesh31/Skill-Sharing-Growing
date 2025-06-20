package com.example.skillv.comment;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CommentRequest {
    @NotBlank(message = "Content cannot be blank")
    private String content;
}
