package com.example.skillv.enrollment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document("enrollments")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Enrollment {
    @Id
    private ObjectId id;
    private String userId;
    private ObjectId roadmapId;
    private LocalDateTime enrolledAt;

    @Builder.Default
    private List<WeekProgress> progress = new ArrayList<>();

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class WeekProgress {
        private int week;
        private boolean completed;
    }
}