package com.panhoramix.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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