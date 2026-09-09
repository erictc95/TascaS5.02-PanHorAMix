package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.response.MediaPageResponse;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.exception.MediaNotFoundException;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import com.panhoramix.backend.service.MediaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MediaController.class)
@AutoConfigureMockMvc(addFilters = false)
class MediaSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MediaService mediaService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void shouldGetMediaByIdSuccessfully() throws Exception {
        MediaResponse response = MediaResponse.builder()
                .build();

        doReturn(response)
                .when(mediaService)
                .getMediaById(1L);

        mockMvc.perform(
                get("/api/media/1")
        ).andExpect(status().isOk());

        verify(mediaService).getMediaById(1L);
    }

    @Test
    void shouldReturnNotFoundWhenMediaDoesNotExist() throws Exception {
        doThrow(new MediaNotFoundException(999L))
                .when(mediaService)
                .getMediaById(999L);

        mockMvc.perform(
                get("/api/media/999")
        ).andExpect(status().isNotFound());

        verify(mediaService).getMediaById(999L);
    }

    @Test
    void shouldGetMyMediaSuccessfully() throws Exception {
        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(0)
                .size(20)
                .totalElements(0)
                .totalPages(0)
                .last(true)
                .build();

        doReturn(response)
                .when(mediaService)
                .getMyMedia(0);

        mockMvc.perform(
                get("/api/media/me")
        ).andExpect(status().isOk());

        verify(mediaService).getMyMedia(0);
    }

    @Test
    void shouldGetMyMediaByPage() throws Exception {
        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(2)
                .size(20)
                .totalElements(40)
                .totalPages(2)
                .last(true)
                .build();

        doReturn(response)
                .when(mediaService)
                .getMyMedia(2);

        mockMvc.perform(
                get("/api/media/me")
                        .param("page", "2")
        ).andExpect(status().isOk());

        verify(mediaService).getMyMedia(2);
    }
}
