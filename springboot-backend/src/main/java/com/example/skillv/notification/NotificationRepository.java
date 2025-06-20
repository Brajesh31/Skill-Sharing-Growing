package com.example.skillv.notification;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByAuthorIdOrderByNotificationCreatedAtDesc(String userId);

    long countByAuthorIdAndNotificationReadFalse(String userId);

    List<Notification> findByAuthorIdAndNotificationReadFalse(String userId);
}
