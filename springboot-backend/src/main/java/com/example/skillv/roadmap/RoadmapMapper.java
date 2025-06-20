package com.example.skillv.roadmap;

import com.example.skillv.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoadmapMapper {

    private final CommentMapper commentMapper;

    public Roadmap toEntity(RoadmapRequest request) {
        return Roadmap.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .publishedDate(LocalDateTime.now())
                .totalView(0)
                .tags(request.getTags())
                .weeks(mapWeeks(request.getWeeks()))
                .likedUserIds(new HashSet<>())
                .noOfLikes(0)
                .build();
    }

    public RoadmapDto toDto(Roadmap roadmap, String currentUserId) {
        boolean userLiked = roadmap.getLikedUserIds().contains(currentUserId);

        return RoadmapDto.builder()
                .id(roadmap.getId().toHexString())
                .title(roadmap.getTitle())
                .description(roadmap.getDescription())
                .category(roadmap.getCategory())
                .authorId(roadmap.getAuthorId())
                .authorName(roadmap.getAuthorName())
                .authorImg(roadmap.getAuthorImg())
                .publishedDate(roadmap.getPublishedDate())
                .totalView(roadmap.getTotalView())
                .weeks(mapWeeksToDto(roadmap.getWeeks()))
                .tags(roadmap.getTags())
                .comments(roadmap.getComments().stream()
                        .map(commentMapper::toDto)
                        .collect(Collectors.toList()))
                .noOfLikes(roadmap.getNoOfLikes())
                .userLiked(userLiked)
                .build();
    }

    public void updateEntityFromRequest(RoadmapRequest request, Roadmap roadmap) {
        roadmap.setTitle(request.getTitle());
        roadmap.setDescription(request.getDescription());
        roadmap.setCategory(request.getCategory());
        roadmap.setTags(request.getTags());
        roadmap.setWeeks(mapWeeks(request.getWeeks()));
    }

    private List<Roadmap.Week> mapWeeks(List<WeekRequest> weekRequests) {
        return weekRequests.stream()
                .map(this::mapWeek)
                .collect(Collectors.toList());
    }

    private Roadmap.Week mapWeek(WeekRequest weekRequest) {
        return Roadmap.Week.builder()
                .weekNumber(weekRequest.getWeekNumber())
                .title(weekRequest.getTitle())
                .content(weekRequest.getContent())
                .build();
    }

    private List<WeekDto> mapWeeksToDto(List<Roadmap.Week> weeks) {
        return weeks.stream()
                .map(this::mapWeekToDto)
                .collect(Collectors.toList());
    }

    private WeekDto mapWeekToDto(Roadmap.Week week) {
        return WeekDto.builder()
                .weekNumber(week.getWeekNumber())
                .title(week.getTitle())
                .content(week.getContent())
                .build();
    }
}