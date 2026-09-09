package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.response.AdminUserResponse;
import com.panhoramix.backend.entity.enums.Role;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import com.panhoramix.backend.service.AdminService;
import com.panhoramix.backend.service.MediaService;
import com.panhoramix.backend.security.config.SecurityConfig;
import org.springframework.context.annotation.Import;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AdminController.class)
@Import(SecurityConfig.class)
class AdminUserManagementControllerTest {

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
    void shouldGetAllUsersSuccessfully() throws Exception {
        when(adminService.getAllUsers())
                .thenReturn(List.of());

        mockMvc.perform(
                get("/api/admin/users")
                        .with(user("admin").roles("ADMIN"))
        ).andExpect(status().isOk());

        verify(adminService).getAllUsers();
    }

    @Test
    void shouldGetUserByIdSuccessfully() throws Exception {
        AdminUserResponse response = AdminUserResponse.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .role(Role.USER)
                .build();

        when(adminService.getUserById(1L))
                .thenReturn(response);

        mockMvc.perform(
                get("/api/admin/users/1")
                        .with(user("admin").roles("ADMIN"))
        ).andExpect(status().isOk());

        verify(adminService).getUserById(1L);
    }

    @Test
    void shouldPromoteUserToAdminSuccessfully() throws Exception {
        AdminUserResponse response = AdminUserResponse.builder()
                .id(1L)
                .username("testuser")
                .email("test@example.com")
                .role(Role.ADMIN)
                .build();

        when(adminService.updateUserRole(1L, Role.ADMIN))
                .thenReturn(response);

        mockMvc.perform(
                patch("/api/admin/users/1/role")
                        .with(user("admin").roles("ADMIN"))
                        .with(csrf())
                        .param("role", "ADMIN")
        ).andExpect(status().isOk());

        verify(adminService).updateUserRole(1L, Role.ADMIN);
    }

    @Test
    void shouldDemoteAdminToUserSuccessfully() throws Exception {
        AdminUserResponse response = AdminUserResponse.builder()
                .id(1L)
                .username("anotheradmin")
                .email("admin@example.com")
                .role(Role.USER)
                .build();

        when(adminService.updateUserRole(1L, Role.USER))
                .thenReturn(response);

        mockMvc.perform(
                patch("/api/admin/users/1/role")
                        .with(user("admin").roles("ADMIN"))
                        .with(csrf())
                        .param("role", "USER")
        ).andExpect(status().isOk());

        verify(adminService).updateUserRole(1L, Role.USER);
    }

    @Test
    void shouldReturnBadRequestWhenRoleIsInvalid() throws Exception {
        mockMvc.perform(
                patch("/api/admin/users/1/role")
                        .with(user("admin").roles("ADMIN"))
                        .with(csrf())
                        .param("role", "INVALID")
        ).andExpect(status().isBadRequest());
    }

    @Test
    void shouldReturnForbiddenForNonAdminUser() throws Exception {
        mockMvc.perform(
                get("/api/admin/users")
                        .with(user("user").roles("USER"))
        ).andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnForbiddenWhenUserIsNotAuthenticated() throws Exception {
        mockMvc.perform(
                get("/api/admin/users")
        ).andExpect(status().isForbidden());
    }
}
