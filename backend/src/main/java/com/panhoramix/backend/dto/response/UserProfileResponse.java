package com.panhoramix.backend.dto.response;

import com.panhoramix.backend.entity.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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

}
