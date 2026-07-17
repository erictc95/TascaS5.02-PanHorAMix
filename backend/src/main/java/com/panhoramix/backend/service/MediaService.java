package com.panhoramix.backend.service;

import com.panhoramix.backend.dto.request.CreateMediaRequest;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.entity.Media;
import com.panhoramix.backend.exception.MediaNotFoundException;
import com.panhoramix.backend.mapper.MediaMapper;
import com.panhoramix.backend.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MediaService {

    private final MediaRepository mediaRepository;
    private final MediaMapper mediaMapper;

    public MediaResponse createMedia(CreateMediaRequest request) {

        Media media = Media.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .visibility(request.getVisibility())
                .mediaType(request.getMediaType())
                .mediaUrl("")
                .thumbnailUrl("")
                .createdAt(LocalDateTime.now())
                .build();

        Media savedMedia = mediaRepository.save(media);

        return mediaMapper.toResponse(savedMedia);
    }

    public List<MediaResponse> getAllMedia() {

        return mediaMapper.toResponseList(mediaRepository.findAll());

    }

    public MediaResponse getMediaById(Long id) {

        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));

        return mediaMapper.toResponse(media);

    }

    public void deleteMedia(Long id) {

        if (!mediaRepository.existsById(id)) {
            throw new MediaNotFoundException(id);
        }

        mediaRepository.deleteById(id);

    }

    public MediaResponse updateMedia(Long id, CreateMediaRequest request) {

        Media media = mediaRepository.findById(id)
                .orElseThrow(() -> new MediaNotFoundException(id));

        media.setTitle(request.getTitle());
        media.setDescription(request.getDescription());
        media.setCategory(request.getCategory());
        media.setVisibility(request.getVisibility());
        media.setMediaType(request.getMediaType());

        Media updatedMedia = mediaRepository.save(media);

        return mediaMapper.toResponse(updatedMedia);
    }

}
