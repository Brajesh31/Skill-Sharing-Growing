package com.example.skillv.notification;

import com.example.skillv.user.User;
import com.example.skillv.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final UserService userService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDto>> getNotificationsForUser(@PathVariable String userId) {
        List<NotificationDto> list = notificationService.getByUser(userId);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/user/{userId}/unread/count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable String userId) {
        long count = notificationService.countUnread(userId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable String notificationId) {
        NotificationDto dto = notificationService.markAsRead(notificationId);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<Void> deleteNotification(@PathVariable String notificationId) {
        notificationService.delete(notificationId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/me/read/all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal) {

        // Get and validate the current user
        String googleId = principal.getAttributes().get("sub").toString();
        User user;
        try {
            user = userService.findByGoogleId(googleId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        notificationService.markAllAsRead(user.getId().toHexString());
        return ResponseEntity.noContent().build();
    }
}
