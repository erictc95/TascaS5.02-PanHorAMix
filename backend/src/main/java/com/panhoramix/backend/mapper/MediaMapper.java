package com.panhoramix.backend.mapper;

import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.entity.Media;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class MediaMapper {

    public MediaResponse toResponse(Media media) {

        return MediaResponse.builder()
                .id(media.getId())
                .title(media.getTitle())
                .description(media.getDescription())
                .mediaUrl(media.getMediaUrl())
                .thumbnailUrl(media.getThumbnailUrl())
                .mediaType(media.getMediaType())
                .category(media.getCategory())
                .visibility(media.getVisibility())
                .createdAt(media.getCreatedAt())
                .build();

    }

    public List<MediaResponse> toResponseList(List<Media> mediaList) {

        return mediaList.stream()
                .map(this::toResponse)
                .toList();

    }

}
