package com.example.skillv.roadmap;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapRepository extends MongoRepository<Roadmap, String> {

    // Find roadmaps by author ID
    List<Roadmap> findByAuthorId(String authorId);

    // Find roadmaps by author ID with sorting
    List<Roadmap> findByAuthorId(String authorId, Sort sort);

    // Find roadmaps by category
    List<Roadmap> findByCategory(String category);

    // Find roadmaps by tag
    List<Roadmap> findByTagsContaining(String tag);

    // Find roadmaps liked by a specific user
    List<Roadmap> findByLikedUserIdsContaining(String userId);
}
