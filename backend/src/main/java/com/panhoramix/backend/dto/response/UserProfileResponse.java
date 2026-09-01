package com.panhoramix.backend.dto.response;

import com.panhoramix.backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    private Long id;

    private String username;

    private String email;

    private Role role;

    private String avatarUrl;

    private String firstName;

    private String lastName;

    private String bio;

    private String bannerUrl;

    private String phoneNumber;

    private LocalDateTime phoneVerifiedAt;

    private LocalDateTime createdAt;

}
