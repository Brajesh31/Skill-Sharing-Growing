package com.example.skillv.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
//mapper
@Component
@RequiredArgsConstructor
public class UserMapper {
    public UserDto toDto(User user) {
        int followersCount = user.getFollowers() != null ? user.getFollowers().size() : 0;
        int followingCount = user.getFollowing() != null ? user.getFollowing().size() : 0;
        return new UserDto(
                user.getId().toHexString(),
                user.getEmail(),
                user.getName(),
                user.getProfileImageUrl(),
                user.getBio(),
                followersCount,
                followingCount,
                false
        );
    }

    public UserDto toDto(User user, User currentUser) {
        int followersCount = user.getFollowers() != null ? user.getFollowers().size() : 0;
        int followingCount = user.getFollowing() != null ? user.getFollowing().size() : 0;

        boolean currentUserFollows = false;
        if (currentUser != null && currentUser.getFollowing() != null) {
            currentUserFollows = currentUser.getFollowing().contains(user.getId());
        }

        return new UserDto(
                user.getId().toHexString(),
                user.getEmail(),
                user.getName(),
                user.getProfileImageUrl(),
                user.getBio(),
                followersCount,
                followingCount,
                currentUserFollows
        );
    }
}
