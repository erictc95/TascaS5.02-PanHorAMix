package com.panhoramix.backend.controller;

import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import com.panhoramix.backend.service.MediaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MediaController.class)
class MediaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MediaService mediaService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;


    @Test
    @WithMockUser
    void shouldUploadVideoSuccessfully() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-video.mp4",
                MediaType.APPLICATION_OCTET_STREAM_VALUE,
                "fake video content".getBytes()
        );

        mockMvc.perform(
                        multipart("/api/media")
                                .file(file)
                                .param("title", "Test Video")
                                .param("description", "Test description")
                                .param("category", "Test")
                                .param("visibility", "PUBLIC")
                                .param("mediaType", "VIDEO")
                                .with(csrf())
                )
                .andExpect(status().isCreated());
    }


    @Test
    @WithMockUser
    void shouldReturnBadRequestWhenRequestIsInvalid() throws Exception {

        mockMvc.perform(
                        multipart("/api/media")
                                .with(csrf())
                )
                .andExpect(status().isBadRequest());
    }


    @Test
    void shouldReturnUnauthorizedWhenUserIsNotAuthenticated() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "test-video.mp4",
                MediaType.APPLICATION_OCTET_STREAM_VALUE,
                "fake video content".getBytes()
        );

        mockMvc.perform(
                        multipart("/api/media")
                                .file(file)
                                .param("title", "Test Video")
                                .param("category", "Test")
                                .param("visibility", "PUBLIC")
                                .param("mediaType", "VIDEO")
                                .with(csrf())
                )
                .andExpect(status().isUnauthorized());
    }
}
