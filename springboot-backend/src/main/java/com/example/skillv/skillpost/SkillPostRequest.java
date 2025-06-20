package com.example.skillv.skillpost;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SkillPostRequest {
    @NotBlank(message = "Skill name is required")
    private String skillName;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Size(max = 3, message = "Maximum of 3 images allowed")
    private ArrayList<String> skillPostImageUrls;

    private String skillPostVideoUrl;

    private String skillPostVideoThumbnailUrl;

    private Integer videoDurationSeconds;
}
