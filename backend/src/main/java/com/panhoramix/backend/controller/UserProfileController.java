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
import com.panhoramix.backend.dto.request.UpdateProfileRequest;
import com.panhoramix.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    private final UserRepository userRepository;
    private final UserService userService;


    @GetMapping("/me")
    public UserProfileResponse me(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole())
                .avatarUrl(user.getAvatarUrl())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .bannerUrl(user.getBannerUrl())
                .phoneNumber(user.getPhoneNumber())
                .phoneVerifiedAt(user.getPhoneVerifiedAt())
                .createdAt(user.getCreatedAt())
                .build();
    }

    @PutMapping("/me")
    public ResponseEntity<Void> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {

        User user = (User) authentication.getPrincipal();

        userService.updateProfile(user.getId(), request);

        return ResponseEntity.ok().build();
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
                .bannerUrl(user.getBannerUrl())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .build();
    }

}
