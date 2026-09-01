package com.panhoramix.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicUserProfileResponse {

    private Long id;

    private String username;

    private String avatarUrl;

    private String bannerUrl;

    private String firstName;

    private String lastName;

    private String bio;

    private LocalDateTime createdAt;
}
