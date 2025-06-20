package com.example.skillv.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User user = userService.findByGoogleId(googleId);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        return ResponseEntity.ok(userMapper.toDto(user));
    }

    @GetMapping("/{user-id}")
    public ResponseEntity<UserDto> getUserById(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal,
            @PathVariable("user-id") String userId
    ) {
        User currentUser = null;
        if (principal != null) {
            String googleId = principal.getAttributes().get("sub").toString();
            currentUser = userService.findByGoogleId(googleId);
        }

        User requestedUser = userService.findById(userId);
        return ResponseEntity.ok(userMapper.toDto(requestedUser, currentUser));
    }

    @PostMapping("/follow/{user-id}")
    public ResponseEntity<UserDto> followUser(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal,
            @PathVariable("user-id") String userIdToFollow
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User currentUser = userService.findByGoogleId(googleId);
        User updatedUser = userService.followUser(currentUser.getId().toString(), userIdToFollow);
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    @PostMapping("/unfollow/{user-id}")
    public ResponseEntity<UserDto> unfollowUser(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal,
            @PathVariable("user-id") String userIdToUnfollow
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User currentUser = userService.findByGoogleId(googleId);
        User updatedUser = userService.unfollowUser(currentUser.getId().toString(), userIdToUnfollow);
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    @GetMapping("/{user-id}/followers")
    public ResponseEntity<List<UserDto>> getUserFollowers(
            @PathVariable("user-id") String userId
    ) {
        List<User> followers = userService.getUserFollowers(userId);
        List<UserDto> followerDtos = followers.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(followerDtos);
    }

    @GetMapping("/{user-id}/following")
    public ResponseEntity<List<UserDto>> getUserFollowing(
            @PathVariable("user-id") String userId
    ) {
        List<User> following = userService.getUserFollowing(userId);
        List<UserDto> followingDtos = following.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(followingDtos);
    }

    @PutMapping("/bio")
    public ResponseEntity<UserDto> updateBio(
            @AuthenticationPrincipal OAuth2IntrospectionAuthenticatedPrincipal principal,
            @RequestBody UpdateBioRequest bioRequest
    ) {
        String googleId = principal.getAttributes().get("sub").toString();
        User currentUser = userService.findByGoogleId(googleId);
        User updatedUser = userService.updateBio(currentUser.getId().toString(), bioRequest.getBio());
        return ResponseEntity.ok(userMapper.toDto(updatedUser));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserDto>> searchUsers(
            @RequestParam("q") String query
    ) {
        List<User> users = userService.searchUsers(query);
        List<UserDto> dtos = users.stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
