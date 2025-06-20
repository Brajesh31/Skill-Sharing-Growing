package com.example.skillv.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
//err
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    private ObjectId id;
    @Indexed(unique = true)
    private String email;
    private String name;
    private String profileImageUrl;
    @Indexed(unique = true)
    private String googleId;
    private List<ObjectId> followers;
    private List<ObjectId> following;
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}

