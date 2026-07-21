package com.panhoramix.backend.service;

import com.panhoramix.backend.dto.request.CreateMediaRequest;
import com.panhoramix.backend.dto.response.MediaPageResponse;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.entity.Media;
import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.StorageFolder;
import com.panhoramix.backend.entity.enums.Visibility;
import com.panhoramix.backend.exception.MediaNotFoundException;
import com.panhoramix.backend.mapper.MediaMapper;
import com.panhoramix.backend.repository.MediaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class MediaService {

    private static final int PAGE_SIZE = 20;
    private static final Sort DEFAULT_SORT =
            Sort.by(Sort.Direction.DESC, "createdAt");

    private final MediaRepository mediaRepository;
    private final MediaMapper mediaMapper;
    private final FileStorageService fileStorageService;

    public MediaResponse createMedia(CreateMediaRequest request) {

        Long userId = 1L;

        StorageFolder folder =
                request.getMediaType() == MediaType.IMAGE
                        ? StorageFolder.IMAGES
                        : StorageFolder.VIDEOS;

        String mediaUrl = fileStorageService.uploadFile(
                request.getFile(),
                folder,
                userId
        );

        Media media = Media.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .visibility(request.getVisibility())
                .mediaType(request.getMediaType())
                .mediaUrl(mediaUrl)
                .thumbnailUrl("")
                .createdAt(LocalDateTime.now())
                .build();

        Media savedMedia = mediaRepository.save(media);

        return mediaMapper.toResponse(savedMedia);
    }

    public MediaPageResponse getMedia(
            int page,
            Visibility visibility,
            MediaType mediaType,
            String category) {

        Pageable pageable = PageRequest.of(
                page,
                PAGE_SIZE,
                DEFAULT_SORT);

        Page<Media> mediaPage;

        if (visibility != null) {

            mediaPage = mediaRepository.findByVisibility(
                    visibility,
                    pageable);

        } else if (mediaType != null) {

            mediaPage = mediaRepository.findByMediaType(
                    mediaType,
                    pageable);

        } else if (category != null && !category.isBlank()) {

            mediaPage = mediaRepository.findByCategory(
                    category,
                    pageable);

        } else {

            mediaPage = mediaRepository.findAll(pageable);

        }

        return MediaPageResponse.builder()
                .content(mediaMapper.toResponseList(mediaPage.getContent()))
                .page(mediaPage.getNumber())
                .size(mediaPage.getSize())
                .totalElements(mediaPage.getTotalElements())
                .totalPages(mediaPage.getTotalPages())
                .last(mediaPage.isLast())
                .build();
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

    public MediaResponse updateMedia(
            Long id,
            CreateMediaRequest request) {

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