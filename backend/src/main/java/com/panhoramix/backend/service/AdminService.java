package com.panhoramix.backend.service;

import com.panhoramix.backend.dto.response.AdminUserResponse;
import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.entity.enums.Role;
import com.panhoramix.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final MediaService mediaService;
    private final EmailService emailService;

    public List<AdminUserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public AdminUserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return toResponse(user);
    }

    private AdminUserResponse toResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .avatarUrl(user.getAvatarUrl())
                .avatarEnabled(user.isAvatarEnabled())
                .bannerUrl(user.getBannerUrl())
                .bannerEnabled(user.isBannerEnabled())
                .createdAt(user.getCreatedAt())
                .deletedAt(user.getDeletedAt())
                .build();
    }

    public AdminUserResponse updateUserRole(Long userId, Role newRole) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN
                && newRole == Role.USER
                && userRepository.countByRole(Role.ADMIN) <= 1) {

            throw new IllegalStateException(
                    "At least one administrator must remain"
            );
        }

        user.setRole(newRole);

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    @Transactional
    public void deleteUser(Long userId, String directorNote) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN
                && userRepository.countByRole(Role.ADMIN) <= 1) {

            throw new IllegalStateException(
                    "At least one administrator must remain"
            );
        }

        // Send Director's Note, but never block deletion if email fails.
        try {
            emailService.sendUserDeletionNote(
                    user.getEmail(),
                    user.getUsername(),
                    directorNote
            );
        } catch (Exception e) {
            log.error(
                    "Failed to send Director's Note for user {}. User will still be deleted.",
                    userId,
                    e
            );
        }

        // Delete all user's media and Cloudflare files.
        mediaService.deleteAllMediaByUser(userId);

        // Delete the user. PostgreSQL CASCADE handles related records.
        userRepository.delete(user);
    }
}
