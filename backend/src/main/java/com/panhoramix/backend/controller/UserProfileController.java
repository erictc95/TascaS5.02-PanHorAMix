package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.response.UserProfileResponse;
import com.panhoramix.backend.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {


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

}
