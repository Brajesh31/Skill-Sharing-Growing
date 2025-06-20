package com.example.skillv.user;

import com.example.skillv.exception.ResourceNotFoundException;
import com.example.skillv.notification.NotificationDto;
import com.example.skillv.notification.NotificationMapper;
import com.example.skillv.notification.NotificationService;
import com.example.skillv.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
//ser
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;


    public void createOrUpdateUserFromOAuth(String googleId, String email, String name, String profileImageUrl) {
        userRepository.findByGoogleId(googleId)
                .map(existingUser -> {
                    // Update existing user
                    existingUser.setEmail(email);
                    existingUser.setName(name);
                    existingUser.setProfileImageUrl(profileImageUrl);
                    existingUser.setLastLoginAt(LocalDateTime.now());
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    // Create new user
                    User newUser = new User(
                            new ObjectId(),
                            email,
                            name,
                            profileImageUrl,
                            googleId,
                            new ArrayList<ObjectId>(),
                            new ArrayList<ObjectId>(),
                            "",
                            LocalDateTime.now(),
                            LocalDateTime.now()
                    );
                    return userRepository.save(newUser);
                });
    }

    public User findByEmail(String email) {
        return this.userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public User findByGoogleId(String googleId) {
        return this.userRepository.findByGoogleId(googleId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found given with Google Id"));
    }

    public void deleteByEmail(String email) {
        User user = this.findByEmail(email);

        this.userRepository.deleteById(user.getId().toString());
    }

    public void deleteById(String id) {
        this.userRepository.deleteById(id);
    }

    public User findById(String id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User followUser(String currentUserId, String userIdToFollow) {
        if (currentUserId.equals(userIdToFollow)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }

        User currentUser = findById(currentUserId);
        User userToFollow = findById(userIdToFollow);

        ObjectId userToFollowObjectId = userToFollow.getId();

        if (currentUser.getFollowing() == null) {
            currentUser.setFollowing(new ArrayList<>());
        }

        if (!currentUser.getFollowing().contains(userToFollowObjectId)) {
            currentUser.getFollowing().add(userToFollowObjectId);
            userRepository.save(currentUser);
        }

        if (userToFollow.getFollowers() == null) {
            userToFollow.setFollowers(new ArrayList<>());
        }

        if (!userToFollow.getFollowers().contains(new ObjectId(currentUserId))) {
            userToFollow.getFollowers().add(new ObjectId(currentUserId));
            userRepository.save(userToFollow);

            String notificationText = " started following you.";
            NotificationDto notificationDto = new NotificationDto(
                    null,
                    userToFollow.getId().toHexString(),
                    currentUser.getName(),
                    null,
                    NotificationType.FOLLOW,
                    notificationText,
                    LocalDateTime.now(),
                    false
            );

            notificationService.create(notificationMapper.toEntity(notificationDto));

        }

        return currentUser;
    }

    public User unfollowUser(String currentUserId, String userIdToUnfollow) {
        User currentUser = findById(currentUserId);
        User userToUnfollow = findById(userIdToUnfollow);

        ObjectId userToUnfollowObjectId = userToUnfollow.getId();

        if (currentUser.getFollowing() != null) {
            currentUser.getFollowing().remove(userToUnfollowObjectId);
            userRepository.save(currentUser);
        }

        if (userToUnfollow.getFollowers() != null) {
            userToUnfollow.getFollowers().remove(new ObjectId(currentUserId));
            userRepository.save(userToUnfollow);
        }

        return currentUser;
    }

    public List<User> getUserFollowers(String userId) {
        User user = findById(userId);
        List<ObjectId> followerIds = user.getFollowers();

        if (followerIds == null || followerIds.isEmpty()) {
            return new ArrayList<>();
        }

        return followerIds.stream()
                .map(id -> userRepository.findById(id.toString())
                        .orElse(null))
                .filter(follower -> follower != null)
                .collect(Collectors.toList());
    }

    public List<User> getUserFollowing(String userId) {
        User user = findById(userId);
        List<ObjectId> followingIds = user.getFollowing();

        if (followingIds == null || followingIds.isEmpty()) {
            return new ArrayList<>();
        }

        return followingIds.stream()
                .map(id -> userRepository.findById(id.toString())
                        .orElse(null))
                .filter(following -> following != null)
                .collect(Collectors.toList());
    }

    public User updateBio(String userId, String newBio) {
        User user = findById(userId);
        user.setBio(newBio);
        return userRepository.save(user);
    }


    // Search users by email, name or bio (case‐insensitive).
    public List<User> searchUsers(String searchTerm) {
        return userRepository
                .findByEmailContainingIgnoreCaseOrNameContainingIgnoreCaseOrBioContainingIgnoreCase(
                        searchTerm, searchTerm, searchTerm
                );
    }

}
