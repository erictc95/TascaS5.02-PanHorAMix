package com.panhoramix.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PublicUserProfileResponse {

    private Long id;

    private String username;

    private String avatarUrl;

}
