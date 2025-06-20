package com.example.skillv.user;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
//repo
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    List<User> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCaseOrBioContainingIgnoreCase(
            String email, String name, String bio);
}
