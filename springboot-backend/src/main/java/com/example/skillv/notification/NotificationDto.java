package com.example.skillv.notification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NotificationDto {
    private String notificationId;
    private String userId;
    private String userName;
    private String postId;
    private NotificationType notificationType;
    private String notificationContent;
    private LocalDateTime notificationCreatedAt;
    private boolean notificationRead;
}