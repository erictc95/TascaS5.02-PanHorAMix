package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.response.AdminUserResponse;
import com.panhoramix.backend.dto.response.MediaPageResponse;
import com.panhoramix.backend.service.AdminService;
import com.panhoramix.backend.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final MediaService mediaService;

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/users/{userId}")
    public AdminUserResponse getUserById(
            @PathVariable Long userId) {
        return adminService.getUserById(userId);
    }

    @GetMapping("/media")
    public MediaPageResponse getAllMedia(
            @RequestParam(defaultValue = "0")
            int page) {

        return mediaService.getAllMediaForAdmin(page);
    }

    @GetMapping("/media/user/{userId}")
    public MediaPageResponse getMediaByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0")
            int page) {

        return mediaService.getMediaByUserForAdmin(userId, page);
    }

    @DeleteMapping("/media/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteMedia(
            @PathVariable Long id) {

        mediaService.deleteMediaAsAdmin(id);
    }
}
