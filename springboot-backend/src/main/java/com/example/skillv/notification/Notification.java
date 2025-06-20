package com.example.skillv.notification;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
//
@Document("notifications")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    @Id private ObjectId notificationId;
    private String authorId;
    private String userName;
    private String postId;
    private NotificationType notificationType;
    private String notificationContent;
    private LocalDateTime notificationCreatedAt;
    private boolean notificationRead;
}
