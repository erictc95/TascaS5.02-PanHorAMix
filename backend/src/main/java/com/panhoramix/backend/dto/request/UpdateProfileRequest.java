package com.panhoramix.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {

    private String firstName;

    private String lastName;

    private String bio;

    private String avatarUrl;

    private String bannerUrl;
}
