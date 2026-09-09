package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.response.MediaPageResponse;
import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import com.panhoramix.backend.service.MediaService;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(MediaController.class)
class MediaBrowseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MediaService mediaService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void shouldBrowsePublicMediaByDefault() throws Exception {

        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(0)
                .size(20)
                .totalElements(0)
                .totalPages(0)
                .last(true)
                .build();

        when(mediaService.getMedia(
                eq(0),
                isNull(),
                isNull(),
                isNull()
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/media")
                )
                .andExpect(status().isOk());

        verify(mediaService).getMedia(
                eq(0),
                isNull(),
                isNull(),
                isNull()
        );
    }

    @Test
    void shouldBrowseMediaByPage() throws Exception {

        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(2)
                .size(20)
                .totalElements(40)
                .totalPages(2)
                .last(true)
                .build();

        when(mediaService.getMedia(
                eq(2),
                isNull(),
                isNull(),
                isNull()
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/media")
                                .param("page", "2")
                )
                .andExpect(status().isOk());

        verify(mediaService).getMedia(
                eq(2),
                isNull(),
                isNull(),
                isNull()
        );
    }

    @Test
    void shouldBrowseMediaByVisibility() throws Exception {

        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(0)
                .size(20)
                .totalElements(0)
                .totalPages(0)
                .last(true)
                .build();

        when(mediaService.getMedia(
                eq(0),
                eq(Visibility.PUBLIC),
                isNull(),
                isNull()
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/media")
                                .param("visibility", "PUBLIC")
                )
                .andExpect(status().isOk());

        verify(mediaService).getMedia(
                eq(0),
                eq(Visibility.PUBLIC),
                isNull(),
                isNull()
        );
    }

    @Test
    void shouldBrowseMediaByType() throws Exception {

        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(0)
                .size(20)
                .totalElements(0)
                .totalPages(0)
                .last(true)
                .build();

        when(mediaService.getMedia(
                eq(0),
                isNull(),
                eq(MediaType.VIDEO),
                isNull()
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/media")
                                .param("mediaType", "VIDEO")
                )
                .andExpect(status().isOk());

        verify(mediaService).getMedia(
                eq(0),
                isNull(),
                eq(MediaType.VIDEO),
                isNull()
        );
    }

    @Test
    void shouldBrowseMediaByCategory() throws Exception {

        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(0)
                .size(20)
                .totalElements(0)
                .totalPages(0)
                .last(true)
                .build();

        when(mediaService.getMedia(
                eq(0),
                isNull(),
                isNull(),
                eq("Sports")
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/media")
                                .param("category", "Sports")
                )
                .andExpect(status().isOk());

        verify(mediaService).getMedia(
                eq(0),
                isNull(),
                isNull(),
                eq("Sports")
        );
    }

    @Test
    void shouldBrowsePublicMediaByUser() throws Exception {

        MediaPageResponse response = MediaPageResponse.builder()
                .content(java.util.List.of())
                .page(0)
                .size(20)
                .totalElements(0)
                .totalPages(0)
                .last(true)
                .build();

        when(mediaService.getPublicMediaByUser(
                eq(1L),
                eq(0)
        )).thenReturn(response);

        mockMvc.perform(
                        get("/api/media/user/1")
                )
                .andExpect(status().isOk());

        verify(mediaService).getPublicMediaByUser(
                eq(1L),
                eq(0)
        );
    }
}