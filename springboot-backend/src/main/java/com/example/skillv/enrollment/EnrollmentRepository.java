package com.example.skillv.enrollment;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollment, ObjectId> {

    // Find all enrollments for a specific user
    List<Enrollment> findByUserId(String userId);

    // Find all enrollments for a specific roadmap
    List<Enrollment> findByRoadmapId(ObjectId roadmapId);

    // Find enrollment by user ID and roadmap ID
    Optional<Enrollment> findByUserIdAndRoadmapId(String userId, ObjectId roadmapId);

    // Check if a user is enrolled in a roadmap
    boolean existsByUserIdAndRoadmapId(String userId, ObjectId roadmapId);

    void deleteByRoadmapId(ObjectId roadmapId);
}