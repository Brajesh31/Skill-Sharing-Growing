package com.example.skillv.milestonepost;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MilestonePostRepository extends MongoRepository<MilestonePost, String> {
    // Find posts by creator user ID
    List<MilestonePost> findByAuthorId(String creatorUserId);

    // Find posts by creator user ID with sorting
    List<MilestonePost> findByAuthorId(String creatorUserId, Sort sort);

    // Find posts by creator user ID in a given list of IDs (e.g., for fetching posts from users you follow)
    List<MilestonePost> findByAuthorIdIn(List<String> creatorUserIds);

    // Find posts by creator user ID in a given list of IDs with sorting
    List<MilestonePost> findByAuthorIdIn(List<String> creatorUserIds, Sort sort);

    // Find posts that a specific user has liked

    // Find posts that a specific user has liked
    List<MilestonePost> findByLikedUserIdsContaining(String userId);
}
