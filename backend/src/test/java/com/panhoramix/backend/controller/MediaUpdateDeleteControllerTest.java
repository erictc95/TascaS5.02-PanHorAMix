package com.panhoramix.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.panhoramix.backend.dto.request.UpdateMediaRequest;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.entity.enums.Visibility;
import com.panhoramix.backend.exception.MediaNotFoundException;
import com.panhoramix.backend.service.MediaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MediaController.class)
@AutoConfigureMockMvc(addFilters = false)
class MediaUpdateDeleteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private MediaService mediaService;

    @MockitoBean
    private com.panhoramix.backend.security.jwt.JwtService jwtService;

    @MockitoBean
    private com.panhoramix.backend.repository.UserRepository userRepository;

    @Test
    void shouldUpdateMediaSuccessfully() throws Exception {
        UpdateMediaRequest request = UpdateMediaRequest.builder()
                .title("Updated title")
                .description("Updated description")
                .category("Sports")
                .visibility(Visibility.PUBLIC)
                .build();

        when(mediaService.updateMedia(
                eq(1L),
                any(UpdateMediaRequest.class)
        )).thenReturn(null);

        mockMvc.perform(
                put("/api/media/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request))
        ).andExpect(status().isOk());

        verify(mediaService).updateMedia(
                eq(1L),
                any(UpdateMediaRequest.class)
        );
    }

    @Test
    void shouldReturnBadRequestWhenUpdateRequestIsInvalid() throws Exception {
        mockMvc.perform(
                put("/api/media/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    void shouldDeleteMediaSuccessfully() throws Exception {
        mockMvc.perform(
                delete("/api/media/1")
        ).andExpect(status().isNoContent());

        verify(mediaService).deleteMedia(1L);
    }

    @Test
    void shouldReturnNotFoundWhenDeletingNonExistingMedia() throws Exception {
        doThrow(new MediaNotFoundException(999L))
                .when(mediaService)
                .deleteMedia(999L);

        mockMvc.perform(
                delete("/api/media/999")
        ).andExpect(status().isNotFound());

        verify(mediaService).deleteMedia(999L);
    }
}
