package com.panhoramix.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminMediaDeleteRequest {

    @NotBlank
    private String directorNote;
}
