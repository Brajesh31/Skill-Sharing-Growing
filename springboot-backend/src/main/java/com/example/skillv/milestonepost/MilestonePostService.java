package com.example.skillv.milestonepost;

import com.example.skillv.exception.ResourceNotFoundException;
import com.example.skillv.notification.NotificationDto;
import com.example.skillv.notification.NotificationMapper;
import com.example.skillv.notification.NotificationService;
import com.example.skillv.notification.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MilestonePostService {

    private final MilestonePostRepository milestonePostRepository;
    private final NotificationService notificationService;
    private final NotificationMapper notificationMapper;

    public MilestonePost save(MilestonePost milestonePost) {
        return this.milestonePostRepository.save(milestonePost);
    }

    public MilestonePost update(MilestonePost milestonePost) {
        // Check if exists first
        findById(milestonePost.getMilestonePostId().toHexString());
        return this.milestonePostRepository.save(milestonePost);
    }

    public MilestonePost findById(String id) {
        return this.milestonePostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Milestone post not found with id: " + id));
    }

    public List<MilestonePost> findAll() {
        return milestonePostRepository.findAll();
    }

    // Get all posts sorted by creation date (newest first)
    public List<MilestonePost> findAllSorted() {
        return milestonePostRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // Find posts by user ID
    public List<MilestonePost> findByUserId(String userId) {
        return milestonePostRepository.findByAuthorId(userId,
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // Find posts by users in the given list (e.g., users that the current user follows)
    public List<MilestonePost> findByUserIds(List<String> userIds) {
        return milestonePostRepository.findByAuthorIdIn(userIds,
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    // Find posts liked by a specific user
    public List<MilestonePost> findLikedByUser(String userId) {
        return milestonePostRepository.findByLikedUserIdsContaining(userId);
    }

    // Find posts for feed (posts from followed users + own posts)
    public List<MilestonePost> getFeedForUser(String userId, List<String> followingUserIds) {
        if (!followingUserIds.contains(userId)) {
            followingUserIds.add(userId);
        }

        return milestonePostRepository.findByAuthorIdIn(followingUserIds,
                Sort.by(Sort.Direction.DESC, "createdAt"));
    }

    public void delete(String id) {
        // Check if exists first
        findById(id);
        this.milestonePostRepository.deleteById(id);
    }

    // Add like to post
    public MilestonePost addLike(String postId, String userId, String userName) {
        MilestonePost post = findById(postId);

        if (post.getLikedUserIds().add(userId)) {
            post.setNoOfLikes(post.getNoOfLikes() + 1);
            String notificationText = " liked your " + "'" + post.getTitle() + "'" + " milestone post.";

            NotificationDto notificationDto = new NotificationDto(
                    null,
                    post.getAuthorId(),
                    userName,
                    post.getMilestonePostId().toHexString(),
                    NotificationType.LIKE,
                    notificationText,
                    LocalDateTime.now(),
                    false
            );

            notificationService.create(notificationMapper.toEntity(notificationDto));
        }

        return milestonePostRepository.save(post);
    }

    // Remove like from post
    public MilestonePost removeLike(String postId, String userId) {
        MilestonePost post = findById(postId);
        if (post.getNoOfLikes() > 0) {
            if (post.getLikedUserIds().remove(userId)) {
                post.setNoOfLikes(post.getNoOfLikes() - 1);
            }
        }
        return milestonePostRepository.save(post);
    }
}
