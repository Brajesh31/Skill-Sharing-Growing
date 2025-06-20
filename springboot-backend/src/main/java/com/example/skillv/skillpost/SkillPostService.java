package com.example.skillv.skillpost;

import com.example.skillv.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillPostService {

    private final SkillPostRepository skillPostRepository;

    public SkillPost save(SkillPost skillPost) {
        return this.skillPostRepository.save(skillPost);
    }

    public SkillPost update(SkillPost skillPost) {
        // Check if exists first
        findById(skillPost.getSkillPostId().toHexString());
        return this.skillPostRepository.save(skillPost);
    }

    public SkillPost findById(String id) {
        return this.skillPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill post not found with id: " + id));
    }

    public List<SkillPost> findAll() {
        return skillPostRepository.findAll(Sort.by(Sort.Direction.DESC, "skillPostId"));
    }

    // Find posts by user ID
    public List<SkillPost> findByUserId(String userId) {
        return skillPostRepository.findByAuthorId(userId,
                Sort.by(Sort.Direction.DESC, "skillPostId"));
    }

    // Find posts by users in the given list (e.g., users that the current user follows)
    public List<SkillPost> findByUserIds(List<String> userIds) {
        return skillPostRepository.findByAuthorIdIn(userIds,
                Sort.by(Sort.Direction.DESC, "skillPostId"));
    }

    // Find posts liked by a specific user
    public List<SkillPost> findLikedByUser(String userId) {
        return skillPostRepository.findByLikedUserIdsContaining(userId);
    }

    // Find posts by skill name
    public List<SkillPost> findBySkillName(String skillName) {
        return skillPostRepository.findBySkillName(skillName,
                Sort.by(Sort.Direction.DESC, "skillPostId"));
    }

    // Find posts for feed (posts from followed users + own posts)
    public List<SkillPost> getFeedForUser(String userId, List<String> followingUserIds) {
        if (!followingUserIds.contains(userId)) {
            followingUserIds.add(userId);
        }

        return skillPostRepository.findByAuthorIdIn(followingUserIds,
                Sort.by(Sort.Direction.DESC, "skillPostId"));
    }

    public void delete(String id) {
        // Check if exists first
        findById(id);
        this.skillPostRepository.deleteById(id);
    }

    // Add like to post
    public SkillPost addLike(String postId, String userId) {
        SkillPost post = findById(postId);

        if (post.getLikedUserIds().add(userId)) {
            post.setNoOfLikes(post.getNoOfLikes() + 1);
        }

        return skillPostRepository.save(post);
    }

    // Remove like from post
    public SkillPost removeLike(String postId, String userId) {
        SkillPost post = findById(postId);
        if (post.getNoOfLikes() > 0) {
            if (post.getLikedUserIds().remove(userId)) {
                post.setNoOfLikes(post.getNoOfLikes() - 1);
            }
        }
        return skillPostRepository.save(post);
    }

    public int getTotalLikesForUser(String userId) {
        List<SkillPost> userPosts = findByUserId(userId);
        return userPosts.stream()
                .mapToInt(SkillPost::getNoOfLikes)
                .sum();
    }
}