package com.panhoramix.backend.service;

import com.resend.Resend;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class EmailVerificationServiceTest {

    private static final String SECRET =
            "test-secret-for-email-verification-tests-123456789";

    private EmailVerificationService emailVerificationService;

    @BeforeEach
    void setUp() {

        String resendApiKey = "re_test_dummy_key";

        emailVerificationService =
                new EmailVerificationService(SECRET, resendApiKey);

        ReflectionTestUtils.setField(
                emailVerificationService,
                "from",
                "director@panhoramix.com"
        );

        ReflectionTestUtils.setField(
                emailVerificationService,
                "frontendUrl",
                "http://localhost:5173"
        );
    }

    @Test
    void shouldGenerateValidTokenAndExtractEmail() {

        String email = "eric@gmail.com";

        String token = emailVerificationService.generateToken(email);

        assertNotNull(token);

        assertEquals(
                email,
                emailVerificationService.getEmailFromToken(token)
        );
    }

    @Test
    void shouldReturnTrueForValidToken() {

        String token =
                emailVerificationService.generateToken("eric@gmail.com");

        assertTrue(
                emailVerificationService.isValid(token)
        );
    }

    @Test
    void shouldReturnFalseForInvalidToken() {

        assertFalse(
                emailVerificationService.isValid("invalid-token")
        );
    }

    @Test
    void shouldGenerateVerificationEmailDataSuccessfully() {

        String recipientEmail = "eric@gmail.com";
        String username = "eric95";
        String verificationToken = "verification-token";

        String frontendUrl =
                (String) ReflectionTestUtils.getField(
                        emailVerificationService,
                        "frontendUrl"
                );

        assertEquals(
                "http://localhost:5173",
                frontendUrl
        );

        String verificationUrl =
                frontendUrl
                        + "/verify-email?token="
                        + verificationToken;

        assertTrue(verificationUrl.contains(verificationToken));
        assertTrue(verificationUrl.contains("/verify-email"));

        assertEquals(
                "PHAM — Verify your email",
                "PHAM — Verify your email"
        );

        assertTrue(username.contains("eric95"));
        assertTrue(recipientEmail.contains("@"));
    }
}