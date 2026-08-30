package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.response.MediaPageResponse;
import com.panhoramix.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final MediaService mediaService;

    @GetMapping("/test")
    public String adminTest() {
        return "ADMIN access granted";
    }

    @GetMapping("/media")
    public MediaPageResponse getAllMedia(
            @RequestParam(defaultValue = "0")
            int page) {

        return mediaService.getAllMediaForAdmin(page);
    }
}
