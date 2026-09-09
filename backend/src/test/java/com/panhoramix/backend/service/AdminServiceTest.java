package com.panhoramix.backend.service;

import com.panhoramix.backend.dto.response.AdminUserResponse;
import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.entity.enums.Role;
import com.panhoramix.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MediaService mediaService;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private AdminService adminService;


    @Test
    void shouldPromoteUserToAdminSuccessfully() {

        User user = User.builder()
                .id(1L)
                .username("eric95")
                .email("eric@gmail.com")
                .role(Role.USER)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.save(user))
                .thenReturn(user);

        AdminUserResponse response =
                adminService.updateUserRole(1L, Role.ADMIN);

        assertNotNull(response);
        assertEquals(Role.ADMIN, user.getRole());
        assertEquals(Role.ADMIN, response.getRole());

        verify(userRepository).findById(1L);
        verify(userRepository).save(user);
    }


    @Test
    void shouldDemoteAdminWhenAnotherAdminExists() {

        User user = User.builder()
                .id(1L)
                .username("eric95")
                .email("eric@gmail.com")
                .role(Role.ADMIN)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.countByRole(Role.ADMIN))
                .thenReturn(2L);

        when(userRepository.save(user))
                .thenReturn(user);

        AdminUserResponse response =
                adminService.updateUserRole(1L, Role.USER);

        assertNotNull(response);
        assertEquals(Role.USER, user.getRole());
        assertEquals(Role.USER, response.getRole());

        verify(userRepository).countByRole(Role.ADMIN);
        verify(userRepository).save(user);
    }


    @Test
    void shouldRejectDemotionOfLastAdmin() {

        User user = User.builder()
                .id(1L)
                .username("eric95")
                .email("eric@gmail.com")
                .role(Role.ADMIN)
                .build();

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.countByRole(Role.ADMIN))
                .thenReturn(1L);

        assertThrows(
                IllegalStateException.class,
                () -> adminService.updateUserRole(1L, Role.USER)
        );

        assertEquals(Role.ADMIN, user.getRole());

        verify(userRepository, never())
                .save(any(User.class));
    }


    @Test
    void shouldDeleteUserSuccessfully() {

        Long userId = 1L;
        String directorNote = "Account removed for testing.";

        User user = User.builder()
                .id(userId)
                .username("eric95")
                .email("eric@gmail.com")
                .role(Role.USER)
                .build();

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        adminService.deleteUser(userId, directorNote);

        verify(emailService).sendUserDeletionNote(
                user.getEmail(),
                user.getUsername(),
                directorNote
        );

        verify(mediaService)
                .deleteAllMediaByUser(userId);

        verify(userRepository)
                .delete(user);
    }


    @Test
    void shouldDeleteUserEvenWhenEmailFails() {

        Long userId = 1L;
        String directorNote = "Account removed for testing.";

        User user = User.builder()
                .id(userId)
                .username("eric95")
                .email("eric@gmail.com")
                .role(Role.USER)
                .build();

        when(userRepository.findById(userId))
                .thenReturn(Optional.of(user));

        doThrow(new RuntimeException("Email service failed"))
                .when(emailService)
                .sendUserDeletionNote(
                        user.getEmail(),
                        user.getUsername(),
                        directorNote
                );

        assertDoesNotThrow(() ->
                adminService.deleteUser(userId, directorNote)
        );

        verify(emailService).sendUserDeletionNote(
                user.getEmail(),
                user.getUsername(),
                directorNote
        );

        verify(mediaService)
                .deleteAllMediaByUser(userId);

        verify(userRepository)
                .delete(user);
    }
}