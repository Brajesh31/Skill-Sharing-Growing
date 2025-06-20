package com.example.skillv.notification;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class NotificationMapper {

    public NotificationDto toDto(Notification entity) {
        return new NotificationDto(
                entity.getNotificationId() != null ? entity.getNotificationId().toHexString() : null,
                entity.getAuthorId(),
                entity.getUserName(),
                entity.getPostId(),
                entity.getNotificationType(),
                entity.getNotificationContent(),
                entity.getNotificationCreatedAt(),
                entity.isNotificationRead()
        );
    }

    public Notification toEntity(NotificationDto dto) {
        return Notification.builder()
                .notificationId(dto.getNotificationId() != null ? new org.bson.types.ObjectId(dto.getNotificationId()) : null)
                .authorId(dto.getUserId())
                .userName(dto.getUserName())
                .postId(dto.getPostId())
                .notificationType(dto.getNotificationType())
                .notificationContent(dto.getNotificationContent())
                .notificationCreatedAt(dto.getNotificationCreatedAt() != null ? dto.getNotificationCreatedAt() : java.time.LocalDateTime.now())
                .notificationRead(dto.isNotificationRead())
                .build();
    }
}
