package com.panhoramix.backend.service;

import com.panhoramix.backend.dto.request.ChangePasswordRequest;
import com.panhoramix.backend.dto.request.LoginRequest;
import com.panhoramix.backend.dto.request.RegisterRequest;
import com.panhoramix.backend.dto.response.LoginResponse;
import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.entity.enums.Role;
import com.panhoramix.backend.exception.EmailAlreadyExistsException;
import com.panhoramix.backend.exception.EmailNotVerifiedException;
import com.panhoramix.backend.exception.InvalidCredentialsException;
import com.panhoramix.backend.exception.UsernameAlreadyExistsException;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.panhoramix.backend.dto.request.UpdateProfileRequest;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ProfileImageService profileImageService;
    private final FileStorageService fileStorageService;
    private final EmailVerificationService emailVerificationService;
    private static final Duration RESEND_COOLDOWN = Duration.ofMinutes(5);
    private static final int MAX_RESENDS_PER_DAY = 5;
    private final Map<String, LocalDateTime> resendCooldowns = new ConcurrentHashMap<>();
    private final Map<String, Integer> resendDailyCounts = new ConcurrentHashMap<>();
    private final Map<String, LocalDate> resendDailyDates = new ConcurrentHashMap<>();

    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException();
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException();
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .phoneVerifiedAt(null)
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        String verificationToken =
                emailVerificationService.generateToken(user.getEmail());

        emailVerificationService.sendVerificationEmail(
                user.getEmail(),
                user.getUsername(),
                verificationToken
        );
    }

    public void verifyEmail(String token) {

        if (!emailVerificationService.isValid(token)) {
            throw new InvalidCredentialsException();
        }

        String email = emailVerificationService.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(InvalidCredentialsException::new);

        if (user.getPhoneVerifiedAt() == null) {
            user.setPhoneVerifiedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);
        }
    }

    public void resendVerification(String email) {

        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            return;
        }

        if (user.getPhoneVerifiedAt() != null) {
            return;
        }

        String userEmail = user.getEmail();
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = now.toLocalDate();

        LocalDate lastAttemptDate = resendDailyDates.get(userEmail);

        if (lastAttemptDate == null || !lastAttemptDate.equals(today)) {
            resendDailyDates.put(userEmail, today);
            resendDailyCounts.put(userEmail, 0);
        }

        int dailyCount = resendDailyCounts.getOrDefault(userEmail, 0);

        if (dailyCount >= MAX_RESENDS_PER_DAY) {
            return;
        }

        LocalDateTime lastResend = resendCooldowns.get(userEmail);

        if (lastResend != null
                && Duration.between(lastResend, now).compareTo(RESEND_COOLDOWN) < 0) {
            return;
        }

        try {

            String verificationToken =
                    emailVerificationService.generateToken(userEmail);

            emailVerificationService.sendVerificationEmail(
                    userEmail,
                    user.getUsername(),
                    verificationToken
            );

            resendCooldowns.put(userEmail, now);
            resendDailyCounts.put(userEmail, dailyCount + 1);

        } catch (Exception e) {

            throw e;
        }
    }

    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException();
        }

        if (user.getPhoneVerifiedAt() == null) {
            throw new EmailNotVerifiedException();
        }

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .token(token)
                .build();

    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void updateProfile(Long userId, UpdateProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setBio(request.getBio());
        user.setAvatarUrl(request.getAvatarUrl());
        user.setBannerUrl(request.getBannerUrl());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    public void updateProfile(
            Long userId,
            String firstName,
            String lastName,
            String bio,
            MultipartFile avatar,
            MultipartFile banner,
            boolean removeAvatar,
            boolean removeBanner) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String oldAvatarUrl = user.getAvatarUrl();
        String oldBannerUrl = user.getBannerUrl();

        String newAvatarUrl = null;
        String newBannerUrl = null;

        try {

            // Upload new avatar
            if (avatar != null && !avatar.isEmpty()) {
                newAvatarUrl = profileImageService.uploadAvatar(
                        avatar,
                        userId
                );
            }

            // Upload new banner
            if (banner != null && !banner.isEmpty()) {
                newBannerUrl = profileImageService.uploadBanner(
                        banner,
                        userId
                );
            }

            // Personal details
            user.setFirstName(
                    firstName == null || firstName.isBlank()
                            ? null
                            : firstName
            );

            user.setLastName(
                    lastName == null || lastName.isBlank()
                            ? null
                            : lastName
            );

            user.setBio(
                    bio == null || bio.isBlank()
                            ? null
                            : bio
            );

            // Avatar
            if (newAvatarUrl != null) {
                user.setAvatarUrl(newAvatarUrl);
            } else if (removeAvatar) {
                user.setAvatarUrl(null);
            }

            // Banner
            if (newBannerUrl != null) {
                user.setBannerUrl(newBannerUrl);
            } else if (removeBanner) {
                user.setBannerUrl(null);
            }

            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);

            // Delete old avatar after successful save
            if (newAvatarUrl != null && oldAvatarUrl != null) {
                fileStorageService.deleteFile(oldAvatarUrl);
            }

            if (removeAvatar && newAvatarUrl == null && oldAvatarUrl != null) {
                fileStorageService.deleteFile(oldAvatarUrl);
            }

            // Delete old banner after successful save
            if (newBannerUrl != null && oldBannerUrl != null) {
                fileStorageService.deleteFile(oldBannerUrl);
            }

            if (removeBanner && newBannerUrl == null && oldBannerUrl != null) {
                fileStorageService.deleteFile(oldBannerUrl);
            }

        } catch (Exception ex) {

            // Clean up newly uploaded files if the database update fails
            if (newAvatarUrl != null) {
                try {
                    fileStorageService.deleteFile(newAvatarUrl);
                } catch (Exception ignored) {
                }
            }

            if (newBannerUrl != null) {
                try {
                    fileStorageService.deleteFile(newBannerUrl);
                } catch (Exception ignored) {
                }
            }

            throw ex;
        }
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);
    }

    public void updateAvatarEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAvatarEnabled(enabled);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    public void updateBannerEnabled(Long userId, boolean enabled) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setBannerEnabled(enabled);
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }
}
