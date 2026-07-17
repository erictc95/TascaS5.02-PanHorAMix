package com.panhoramix.backend.dto.request;

import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMediaRequest {

    private String title;

    private String description;

    private String category;

    private MediaType mediaType;

    private Visibility visibility;

}
