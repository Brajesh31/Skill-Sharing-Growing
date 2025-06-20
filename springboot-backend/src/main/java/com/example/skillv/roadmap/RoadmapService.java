package com.example.skillv.roadmap;

import com.example.skillv.comment.Comment;
import com.example.skillv.enrollment.EnrollmentRepository;
import com.example.skillv.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final EnrollmentRepository enrollmentRepository;

    // Roadmap operations
    public Roadmap createRoadmap(Roadmap roadmap) {
        return roadmapRepository.save(roadmap);
    }

    public Roadmap getRoadmapById(String id) {
        return roadmapRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap not found with id: " + id));
    }

    public List<Roadmap> getAllRoadmaps() {
        return roadmapRepository.findAll(Sort.by(Sort.Direction.DESC, "publishedDate"));
    }

    public Roadmap updateRoadmap(Roadmap roadmap) {
        // Check if exists
        getRoadmapById(roadmap.getId().toHexString());
        return roadmapRepository.save(roadmap);
    }

    public void deleteRoadmap(String id) {
        // Check if exists
        getRoadmapById(id);
        roadmapRepository.deleteById(id);
    }

    public List<Roadmap> getRoadmapsByAuthor(String authorId) {
        return roadmapRepository.findByAuthorId(authorId,
                Sort.by(Sort.Direction.DESC, "publishedDate"));
    }

    public List<Roadmap> getRoadmapsByCategory(String category) {
        return roadmapRepository.findByCategory(category);
    }

    public List<Roadmap> getRoadmapsByTag(String tag) {
        return roadmapRepository.findByTagsContaining(tag);
    }

    public List<Roadmap> getLikedRoadmaps(String userId) {
        return roadmapRepository.findByLikedUserIdsContaining(userId);
    }

    // View count operations
    public Roadmap incrementViewCount(String roadmapId) {
        Roadmap roadmap = getRoadmapById(roadmapId);
        roadmap.setTotalView(roadmap.getTotalView() + 1);
        return roadmapRepository.save(roadmap);
    }

    // Like operations
    public Roadmap addLike(String roadmapId, String userId) {
        Roadmap roadmap = getRoadmapById(roadmapId);

        if (roadmap.getLikedUserIds().add(userId)) {
            roadmap.setNoOfLikes(roadmap.getNoOfLikes() + 1);
        }

        return roadmapRepository.save(roadmap);
    }

    public Roadmap removeLike(String roadmapId, String userId) {
        Roadmap roadmap = getRoadmapById(roadmapId);

        if (roadmap.getLikedUserIds().remove(userId)) {
            roadmap.setNoOfLikes(Math.max(0, roadmap.getNoOfLikes() - 1));
        }

        return roadmapRepository.save(roadmap);
    }

    // Comment operations
    public Roadmap addComment(String roadmapId, Comment comment) {
        Roadmap roadmap = getRoadmapById(roadmapId);

        if (roadmap.getComments() == null) {
            roadmap.setComments(new ArrayList<>());
        }

        roadmap.getComments().add(comment);
        return roadmapRepository.save(roadmap);
    }

    public Roadmap updateComment(String roadmapId, String commentId, String content) {
        Roadmap roadmap = getRoadmapById(roadmapId);

        roadmap.getComments().stream()
                .filter(c -> c.getCommentId().equals(new ObjectId(commentId)))
                .findFirst()
                .ifPresent(comment -> comment.setContent(content));

        return roadmapRepository.save(roadmap);
    }

    public Roadmap deleteComment(String roadmapId, String commentId) {
        Roadmap roadmap = getRoadmapById(roadmapId);

        roadmap.getComments().removeIf(comment ->
                comment.getCommentId().equals(new ObjectId(commentId)));

        return roadmapRepository.save(roadmap);
    }

    public boolean isUserEnrolled(String userId, String roadmapId) {
        return enrollmentRepository.existsByUserIdAndRoadmapId(userId, new ObjectId(roadmapId));
    }
}