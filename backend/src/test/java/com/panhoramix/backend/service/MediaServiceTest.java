package com.panhoramix.backend.service;

import com.panhoramix.backend.dto.request.CreateMediaRequest;
import com.panhoramix.backend.dto.response.MediaPageResponse;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.entity.Media;
import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import com.panhoramix.backend.mapper.MediaMapper;
import com.panhoramix.backend.repository.MediaRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.mock.web.MockMultipartFile;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;


import java.util.List;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MediaServiceTest {

    @Mock
    private MediaRepository mediaRepository;

    @Mock
    private MediaMapper mediaMapper;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private CurrentUserService currentUserService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private MediaService mediaService;

    @Test
    void shouldCreateMediaSuccessfully() {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "video.mp4",
                "video/mp4",
                "fake video".getBytes()
        );

        CreateMediaRequest request = CreateMediaRequest.builder()
                .title("Test Video")
                .description("Test description")
                .category("Cinema")
                .visibility(Visibility.PUBLIC)
                .mediaType(MediaType.VIDEO)
                .file(file)
                .build();

        User user = mock(User.class);

        when(user.getId()).thenReturn(1L);

        when(currentUserService.getCurrentUser())
                .thenReturn(user);

        Media savedMedia = mock(Media.class);
        MediaResponse response = mock(MediaResponse.class);

        when(fileStorageService.uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.VIDEOS),
                eq(1L)
        )).thenReturn("https://storage.test/video.mp4");

        when(mediaRepository.save(any(Media.class)))
                .thenReturn(savedMedia);

        when(mediaMapper.toResponse(savedMedia))
                .thenReturn(response);

        MediaResponse result = mediaService.createMedia(request);

        assertNotNull(result);

        verify(currentUserService).getCurrentUser();

        verify(fileStorageService).uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.VIDEOS),
                eq(1L)
        );

        verify(mediaRepository).save(any(Media.class));

        verify(mediaMapper).toResponse(savedMedia);
    }

    @Test
    void shouldGetPublicMediaByDefault() {

        Media media = mock(Media.class);

        PageImpl<Media> page = new PageImpl<>(
                List.of(media),
                PageRequest.of(
                        0,
                        20,
                        Sort.by(Sort.Direction.DESC, "createdAt")
                ),
                1
        );

        MediaResponse response = mock(MediaResponse.class);

        when(mediaRepository.findByVisibility(
                eq(Visibility.PUBLIC),
                any()
        )).thenReturn(page);

        when(mediaMapper.toResponseList(List.of(media)))
                .thenReturn(List.of(response));

        MediaPageResponse result =
                mediaService.getMedia(
                        0,
                        null,
                        null,
                        null
                );

        assertNotNull(result);

        verify(mediaRepository).findByVisibility(
                eq(Visibility.PUBLIC),
                any()
        );

        verify(mediaMapper).toResponseList(List.of(media));
    }

    @Test
    void shouldGetMediaByVisibility() {

        Media media = mock(Media.class);

        PageImpl<Media> page = new PageImpl<>(
                List.of(media)
        );

        when(mediaRepository.findByVisibility(
                eq(Visibility.PRIVATE),
                any()
        )).thenReturn(page);

        when(mediaMapper.toResponseList(List.of(media)))
                .thenReturn(List.of(mock(MediaResponse.class)));

        MediaPageResponse result =
                mediaService.getMedia(
                        0,
                        Visibility.PRIVATE,
                        null,
                        null
                );

        assertNotNull(result);

        verify(mediaRepository).findByVisibility(
                eq(Visibility.PRIVATE),
                any()
        );

        verify(mediaRepository, never())
                .findByMediaType(any(), any());

        verify(mediaRepository, never())
                .findByCategory(any(), any());
    }

    @Test
    void shouldGetMediaByType() {

        Media media = mock(Media.class);

        PageImpl<Media> page = new PageImpl<>(
                List.of(media)
        );

        when(mediaRepository.findByMediaType(
                eq(MediaType.VIDEO),
                any()
        )).thenReturn(page);

        when(mediaMapper.toResponseList(List.of(media)))
                .thenReturn(List.of(mock(MediaResponse.class)));

        MediaPageResponse result =
                mediaService.getMedia(
                        0,
                        null,
                        MediaType.VIDEO,
                        null
                );

        assertNotNull(result);

        verify(mediaRepository).findByMediaType(
                eq(MediaType.VIDEO),
                any()
        );

        verify(mediaRepository, never())
                .findByVisibility(any(), any());

        verify(mediaRepository, never())
                .findByCategory(any(), any());
    }

    @Test
    void shouldGetMediaByCategory() {

        Media media = mock(Media.class);

        PageImpl<Media> page = new PageImpl<>(
                List.of(media)
        );

        when(mediaRepository.findByCategory(
                eq("Cinema"),
                any()
        )).thenReturn(page);

        when(mediaMapper.toResponseList(List.of(media)))
                .thenReturn(List.of(mock(MediaResponse.class)));

        MediaPageResponse result =
                mediaService.getMedia(
                        0,
                        null,
                        null,
                        "Cinema"
                );

        assertNotNull(result);

        verify(mediaRepository).findByCategory(
                eq("Cinema"),
                any()
        );

        verify(mediaRepository, never())
                .findByVisibility(any(), any());

        verify(mediaRepository, never())
                .findByMediaType(any(), any());
    }

    @Test
    void shouldUploadImageToImagesFolder() {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.jpg",
                "image/jpeg",
                "fake image".getBytes()
        );

        CreateMediaRequest request = CreateMediaRequest.builder()
                .title("Test Image")
                .description("Test description")
                .category("Photography")
                .visibility(Visibility.PUBLIC)
                .mediaType(MediaType.IMAGE)
                .file(file)
                .build();

        User user = mock(User.class);

        when(user.getId()).thenReturn(1L);

        when(currentUserService.getCurrentUser())
                .thenReturn(user);

        Media savedMedia = mock(Media.class);
        MediaResponse response = mock(MediaResponse.class);

        when(fileStorageService.uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.IMAGES),
                eq(1L)
        )).thenReturn("https://storage.test/image.jpg");

        when(mediaRepository.save(any(Media.class)))
                .thenReturn(savedMedia);

        when(mediaMapper.toResponse(savedMedia))
                .thenReturn(response);

        MediaResponse result = mediaService.createMedia(request);

        assertNotNull(result);

        verify(fileStorageService).uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.IMAGES),
                eq(1L)
        );

        verify(mediaRepository).save(any(Media.class));
        verify(mediaMapper).toResponse(savedMedia);
    }


    @Test
    void shouldUploadVideoToVideosFolder() {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-video.mp4",
                "video/mp4",
                "fake video".getBytes()
        );

        CreateMediaRequest request = CreateMediaRequest.builder()
                .title("Test Video")
                .description("Test description")
                .category("Cinema")
                .visibility(Visibility.PUBLIC)
                .mediaType(MediaType.VIDEO)
                .file(file)
                .build();

        User user = mock(User.class);

        when(user.getId()).thenReturn(1L);

        when(currentUserService.getCurrentUser())
                .thenReturn(user);

        Media savedMedia = mock(Media.class);
        MediaResponse response = mock(MediaResponse.class);

        when(fileStorageService.uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.VIDEOS),
                eq(1L)
        )).thenReturn("https://storage.test/video.mp4");

        when(mediaRepository.save(any(Media.class)))
                .thenReturn(savedMedia);

        when(mediaMapper.toResponse(savedMedia))
                .thenReturn(response);

        MediaResponse result = mediaService.createMedia(request);

        assertNotNull(result);

        verify(fileStorageService).uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.VIDEOS),
                eq(1L)
        );

        verify(mediaRepository).save(any(Media.class));
        verify(mediaMapper).toResponse(savedMedia);
    }


    @Test
    void shouldDeleteUploadedFileWhenSavingMediaFails() {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.jpg",
                "image/jpeg",
                "fake image".getBytes()
        );

        CreateMediaRequest request = CreateMediaRequest.builder()
                .title("Test Image")
                .description("Test description")
                .category("Photography")
                .visibility(Visibility.PUBLIC)
                .mediaType(MediaType.IMAGE)
                .file(file)
                .build();

        User user = mock(User.class);

        when(user.getId()).thenReturn(1L);

        when(currentUserService.getCurrentUser())
                .thenReturn(user);

        RuntimeException saveException =
                new RuntimeException("Database error");

        when(fileStorageService.uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.IMAGES),
                eq(1L)
        )).thenReturn("https://storage.test/orphaned-image.jpg");

        when(mediaRepository.save(any(Media.class)))
                .thenThrow(saveException);

        RuntimeException thrown = assertThrows(
                RuntimeException.class,
                () -> mediaService.createMedia(request)
        );

        assertSame(saveException, thrown);

        verify(fileStorageService).deleteFile(
                "https://storage.test/orphaned-image.jpg"
        );

        verify(mediaRepository).save(any(Media.class));
        verifyNoInteractions(mediaMapper);
    }


    @Test
    void shouldKeepOriginalExceptionWhenCleanupAlsoFails() {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-image.jpg",
                "image/jpeg",
                "fake image".getBytes()
        );

        CreateMediaRequest request = CreateMediaRequest.builder()
                .title("Test Image")
                .description("Test description")
                .category("Photography")
                .visibility(Visibility.PUBLIC)
                .mediaType(MediaType.IMAGE)
                .file(file)
                .build();

        User user = mock(User.class);

        when(user.getId()).thenReturn(1L);

        when(currentUserService.getCurrentUser())
                .thenReturn(user);

        RuntimeException saveException =
                new RuntimeException("Database error");

        when(fileStorageService.uploadFile(
                eq(file),
                eq(com.panhoramix.backend.entity.enums.StorageFolder.IMAGES),
                eq(1L)
        )).thenReturn("https://storage.test/orphaned-image.jpg");

        when(mediaRepository.save(any(Media.class)))
                .thenThrow(saveException);

        doThrow(new RuntimeException("Storage cleanup error"))
                .when(fileStorageService)
                .deleteFile("https://storage.test/orphaned-image.jpg");

        RuntimeException thrown = assertThrows(
                RuntimeException.class,
                () -> mediaService.createMedia(request)
        );

        assertSame(saveException, thrown);

        verify(fileStorageService).deleteFile(
                "https://storage.test/orphaned-image.jpg"
        );

        verify(mediaRepository).save(any(Media.class));
        verifyNoInteractions(mediaMapper);
    }
}
