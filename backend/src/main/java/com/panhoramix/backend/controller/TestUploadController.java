package com.panhoramix.backend.controller;

import com.panhoramix.backend.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/test")
public class TestUploadController {

    private final FileStorageService fileStorageService;

    public TestUploadController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<String> uploadTestFile(
            @RequestParam("file") MultipartFile file) {

        String url = fileStorageService.uploadFile(file, "images");

        return ResponseEntity.ok(url);
    }
}