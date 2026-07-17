package com.panhoramix.backend.dto.response;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MediaPageResponse {

    private List<MediaResponse> content;

    private int page;

    private int size;

    private long totalElements;

    private int totalPages;

    private boolean last;

}