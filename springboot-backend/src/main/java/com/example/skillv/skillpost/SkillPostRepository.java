package com.example.skillv.skillpost;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
    List<SkillPost> findByAuthorId(String authorId, Sort sort);

    List<SkillPost> findByAuthorIdIn(List<String> authorIds, Sort sort);

    List<SkillPost> findByLikedUserIdsContaining(String userId);

    List<SkillPost> findBySkillName(String skillName, Sort sort);
}