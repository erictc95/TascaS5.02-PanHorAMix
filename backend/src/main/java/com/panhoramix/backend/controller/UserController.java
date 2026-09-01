package com.panhoramix.backend.controller;

import com.panhoramix.backend.dto.request.LoginRequest;
import com.panhoramix.backend.dto.request.RegisterRequest;
import com.panhoramix.backend.dto.response.LoginResponse;
import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.service.UserService;
import com.panhoramix.backend.dto.request.ChangePasswordRequest;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@Valid @RequestBody RegisterRequest request) {

        userService.register(request);

    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        return userService.login(request);

    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> changePassword(
            @AuthenticationPrincipal User user,
            @RequestBody ChangePasswordRequest request) {

        userService.changePassword(user.getId(), request);

        return ResponseEntity.noContent().build();
    }

}
