package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.request.CreateMediaRequest;
import com.panhoramix.backend.dto.response.MediaResponse;
import com.panhoramix.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MediaResponse createMedia(@RequestBody CreateMediaRequest request) {
        return mediaService.createMedia(request);
    }

    @GetMapping
    public List<MediaResponse> getAllMedia() {

        return mediaService.getAllMedia();

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

}
