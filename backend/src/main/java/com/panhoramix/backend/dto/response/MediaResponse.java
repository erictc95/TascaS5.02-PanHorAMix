package com.panhoramix.backend.dto.response;

import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaResponse {

    private Long id;

    private String title;

    private String description;

    private String mediaUrl;

    private String thumbnailUrl;

    private MediaType mediaType;

    private String category;

    private Visibility visibility;

    private LocalDateTime createdAt;

}
