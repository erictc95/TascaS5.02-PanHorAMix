package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.request.UpdateProfileRequest;
import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.entity.enums.Role;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import com.panhoramix.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.security.core.Authentication;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.authentication;

import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class UserProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRepository userRepository;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtService jwtService;


    private User createUser() {
        return User.builder()
                .id(1L)
                .username("eric95")
                .email("eric@gmail.com")
                .role(Role.USER)
                .firstName("Eric")
                .lastName("Tarres")
                .bio("Test bio")
                .avatarUrl("https://example.com/avatar.jpg")
                .avatarEnabled(true)
                .bannerUrl("https://example.com/banner.jpg")
                .bannerEnabled(true)
                .build();
    }

    private Authentication createAuthentication(User user) {
        return new UsernamePasswordAuthenticationToken(
                user,
                null,
                List.of()
        );
    }

    @Test
    void shouldGetMyProfileSuccessfully() throws Exception {

        User user = createUser();

        mockMvc.perform(
                        get("/api/users/me")
                                .with(authentication(createAuthentication(user)))
                )
                .andExpect(status().isOk());
    }


    @Test
    void shouldUpdateMyProfileSuccessfully() throws Exception {

        User user = createUser();

        String requestBody = """
                {
                    "firstName": "John",
                    "lastName": "Doe",
                    "bio": "Updated bio",
                    "avatarUrl": "https://example.com/new-avatar.jpg",
                    "bannerUrl": "https://example.com/new-banner.jpg"
                }
                """;

        mockMvc.perform(
                        put("/api/users/me")
                                .contentType("application/json")
                                .content(requestBody)
                                .with(authentication(createAuthentication(user)))
                )
                .andExpect(status().isOk());

        verify(userService).updateProfile(
                eq(user.getId()),
                any(UpdateProfileRequest.class)
        );
    }


    @Test
    void shouldUpdateMyProfileWithMultipartSuccessfully() throws Exception {

        User user = createUser();

        MockMultipartFile avatar = new MockMultipartFile(
                "avatar",
                "avatar.jpg",
                "image/jpeg",
                "fake-avatar-content".getBytes()
        );

        MockMultipartFile banner = new MockMultipartFile(
                "banner",
                "banner.jpg",
                "image/jpeg",
                "fake-banner-content".getBytes()
        );

        mockMvc.perform(
                        multipart("/api/users/me")
                                .file(avatar)
                                .file(banner)
                                .param("firstName", "John")
                                .param("lastName", "Doe")
                                .param("bio", "Updated bio")
                                .param("removeAvatar", "false")
                                .param("removeBanner", "false")
                                .with(request -> {
                                    request.setMethod("PUT");
                                    return request;
                                })
                                .with(authentication(createAuthentication(user)))
                )
                .andExpect(status().isOk());

        verify(userService).updateProfile(
                eq(user.getId()),
                eq("John"),
                eq("Doe"),
                eq("Updated bio"),
                eq(avatar),
                eq(banner),
                eq(false),
                eq(false)
        );
    }


    @Test
    void shouldGetPublicProfileSuccessfully() throws Exception {

        User user = createUser();

        when(userRepository.findByUsername("eric95"))
                .thenReturn(Optional.of(user));

        mockMvc.perform(
                        get("/api/users/eric95")
                )
                .andExpect(status().isOk());

        verify(userRepository).findByUsername("eric95");
    }


    @Test
    void shouldUpdateAvatarEnabledSuccessfully() throws Exception {

        User user = createUser();

        mockMvc.perform(
                        patch("/api/users/me/avatar-enabled")
                                .param("enabled", "false")
                                .with(authentication(createAuthentication(user)))
                )
                .andExpect(status().isOk());

        verify(userService)
                .updateAvatarEnabled(user.getId(), false);
    }


    @Test
    void shouldUpdateBannerEnabledSuccessfully() throws Exception {

        User user = createUser();

        mockMvc.perform(
                        patch("/api/users/me/banner-enabled")
                                .param("enabled", "false")
                                .with(authentication(createAuthentication(user)))
                )
                .andExpect(status().isOk());

        verify(userService)
                .updateBannerEnabled(user.getId(), false);
    }
}