package com.example.skillv.notification;

import com.example.skillv.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
//
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;

    public NotificationDto create(Notification notification) {
        notification.setNotificationCreatedAt(LocalDateTime.now());
        notification.setNotificationRead(false);
        Notification saved = notificationRepository.save(notification);
        return notificationMapper.toDto(saved);
    }

    public List<NotificationDto> getByUser(String userId) {
        return notificationRepository.findByAuthorIdOrderByNotificationCreatedAtDesc(userId)
                .stream()
                .map(notificationMapper::toDto)
                .collect(Collectors.toList());
    }

    public long countUnread(String userId) {
        return notificationRepository.countByAuthorIdAndNotificationReadFalse(userId);
    }

    public NotificationDto markAsRead(String notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        notif.setNotificationRead(true);
        Notification updated = notificationRepository.save(notif);
        return notificationMapper.toDto(updated);
    }

    public void delete(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByAuthorIdAndNotificationReadFalse(userId);
        notifications.forEach(notification -> notification.setNotificationRead(true));
        notificationRepository.saveAll(notifications);
    }
}