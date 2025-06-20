package com.example.skillv.user;

import lombok.AllArgsConstructor;
import lombok.Data;
//dto
@Data
@AllArgsConstructor
public class UserDto {
    private String id;
    private String email;
    private String name;
    private String profileImageUrl;
    private String bio;
    private int followersCount;
    private int followingCount;
    private boolean currentUserFollows;
}
