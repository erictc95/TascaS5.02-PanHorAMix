package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.request.CreateMediaRequest;
import com.panhoramix.backend.dto.response.MediaPageResponse;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.entity.enums.MediaType;
import com.panhoramix.backend.entity.enums.Visibility;
import com.panhoramix.backend.service.MediaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaResponse createMedia(@Valid @RequestBody CreateMediaRequest request) {
        return mediaService.createMedia(request);
    }

    @GetMapping
    public MediaPageResponse getMedia(

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(required = false)
            Visibility visibility,

            @RequestParam(required = false)
            MediaType mediaType,

            @RequestParam(required = false)
            String category) {

        return mediaService.getMedia(
                page,
                visibility,
                mediaType,
                category);
    }

    @GetMapping("/{id}")
    public MediaResponse getMediaById(@PathVariable Long id) {

        return mediaService.getMediaById(id);

    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedia(@PathVariable Long id) {

        mediaService.deleteMedia(id);

    }

    @PutMapping("/{id}")
    public MediaResponse updateMedia(
            @PathVariable Long id,
            @Valid @RequestBody CreateMediaRequest request) {

        return mediaService.updateMedia(id, request);

    }

}
