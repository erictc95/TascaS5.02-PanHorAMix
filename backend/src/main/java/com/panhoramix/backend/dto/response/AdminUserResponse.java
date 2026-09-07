package com.panhoramix.backend.dto.response;

import com.panhoramix.backend.entity.enums.Role;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class AdminUserResponse {

    private Long id;
    private String username;
    private String email;
    private Role role;
    private String firstName;
    private String lastName;
    private String avatarUrl;
    private boolean avatarEnabled;
    private String bannerUrl;
    private boolean bannerEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;
}
