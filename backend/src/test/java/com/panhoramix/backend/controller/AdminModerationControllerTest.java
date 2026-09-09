package com.panhoramix.backend.controller;

import com.panhoramix.backend.exception.MediaNotFoundException;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import com.panhoramix.backend.service.AdminService;
import com.panhoramix.backend.service.MediaService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
class AdminModerationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AdminService adminService;

    @MockitoBean
    private MediaService mediaService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    void shouldDeleteMediaAsAdminSuccessfully() throws Exception {
        mockMvc.perform(
                delete("/api/admin/media/1")
                        .with(user("admin").roles("ADMIN"))
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {
                                    "directorNote": "Content violates community guidelines."
                                }
                                """)
        ).andExpect(status().isNoContent());

        verify(mediaService).deleteMediaAsAdmin(
                eq(1L),
                eq("Content violates community guidelines.")
        );
    }

    @Test
    void shouldReturnBadRequestWhenDirectorNoteIsMissing() throws Exception {
        mockMvc.perform(
                delete("/api/admin/media/1")
                        .with(user("admin").roles("ADMIN"))
                        .with(csrf())
                        .contentType("application/json")
                        .content("{}")
        ).andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnNotFoundWhenMediaDoesNotExist() throws Exception {
        doThrow(new MediaNotFoundException(999L))
                .when(mediaService)
                .deleteMediaAsAdmin(
                        eq(999L),
                        anyString()
                );

        mockMvc.perform(
                delete("/api/admin/media/999")
                        .with(user("admin").roles("ADMIN"))
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {
                                    "directorNote": "Content violates community guidelines."
                                }
                                """)
        ).andExpect(status().isNotFound());

        verify(mediaService).deleteMediaAsAdmin(
                eq(999L),
                eq("Content violates community guidelines.")
        );
    }

    @Test
    void shouldReturnForbiddenForNonAdminUser() throws Exception {
        mockMvc.perform(
                delete("/api/admin/media/1")
                        .with(user("user").roles("USER"))
                        .contentType("application/json")
                        .content("""
                                {
                                    "directorNote": "Attempted moderation."
                                }
                                """)
        ).andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnUnauthorizedWhenUserIsNotAuthenticated() throws Exception {
        mockMvc.perform(
                delete("/api/admin/media/1")
                        .with(csrf())
                        .contentType("application/json")
                        .content("""
                                {
                                    "directorNote": "Attempted moderation."
                                }
                                """)
        ).andExpect(status().isUnauthorized());
    }
}