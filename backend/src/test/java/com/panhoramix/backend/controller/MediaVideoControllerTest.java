package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.request.CreateMediaRequest;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.exception.UserNotAuthenticatedException;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import com.panhoramix.backend.service.MediaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MediaController.class)
@AutoConfigureMockMvc(addFilters = false)
class MediaVideoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MediaService mediaService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void shouldUploadVideoSuccessfully() throws Exception {
        MockMultipartFile video = new MockMultipartFile(
                "file",
                "test-video.mp4",
                "video/mp4",
                "fake-video-content".getBytes()
        );

        MediaResponse response = MediaResponse.builder()
                .build();

        when(mediaService.createMedia(any(CreateMediaRequest.class)))
                .thenReturn(response);

        mockMvc.perform(
                        multipart("/api/media")
                                .file(video)
                                .param("title", "Test Video")
                                .param("description", "Test video description")
                                .param("category", "Sports")
                                .param("visibility", "PUBLIC")
                                .param("mediaType", "VIDEO")
                )
                .andExpect(status().isCreated());

        verify(mediaService).createMedia(any(CreateMediaRequest.class));
    }

    @Test
    void shouldReturnBadRequestWhenVideoRequestIsInvalid() throws Exception {
        MockMultipartFile video = new MockMultipartFile(
                "file",
                "test-video.mp4",
                "video/mp4",
                "fake-video-content".getBytes()
        );

        mockMvc.perform(
                        multipart("/api/media")
                                .file(video)
                                .param("description", "Missing required fields")
                                .param("mediaType", "VIDEO")
                )
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnUnauthorizedWhenUserIsNotAuthenticated() throws Exception {
        MockMultipartFile video = new MockMultipartFile(
                "file",
                "test-video.mp4",
                "video/mp4",
                "fake-video-content".getBytes()
        );

        doThrow(new UserNotAuthenticatedException())
                .when(mediaService)
                .createMedia(any(CreateMediaRequest.class));

        mockMvc.perform(
                        multipart("/api/media")
                                .file(video)
                                .param("title", "Test Video")
                                .param("description", "Test video description")
                                .param("category", "Sports")
                                .param("visibility", "PUBLIC")
                                .param("mediaType", "VIDEO")
                )
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code")
                        .value("USER_NOT_AUTHENTICATED"));

        verify(mediaService).createMedia(any(CreateMediaRequest.class));
    }
}