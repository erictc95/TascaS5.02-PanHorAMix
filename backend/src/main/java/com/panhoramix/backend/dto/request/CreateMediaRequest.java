package com.panhoramix.backend.dto.request;

import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMediaRequest {

    @NotBlank(message = "Title is required.")
    private String title;

    private String description;

    @NotBlank(message = "Category is required.")
    private String category;

    @NotNull(message = "Visibility is required.")
    private Visibility visibility;

    @NotNull(message = "Media type is required.")
    private MediaType mediaType;

}
