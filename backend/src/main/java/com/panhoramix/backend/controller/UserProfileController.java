package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.response.UserProfileResponse;
import com.panhoramix.backend.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.panhoramix.backend.dto.response.PublicUserProfileResponse;
import com.panhoramix.backend.repository.UserRepository;
import org.springframework.web.bind.annotation.PathVariable;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserRepository userRepository;


    @GetMapping("/me")
    public UserProfileResponse me(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .build();

    }

    @GetMapping("/{username}")
    public PublicUserProfileResponse getPublicProfile(
            @PathVariable String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return PublicUserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

}
