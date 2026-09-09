package com.panhoramix.backend.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    private JavaMailSender mailSender;
    private EmailVerificationService emailVerificationService;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);

        emailVerificationService =
                new EmailVerificationService(SECRET, mailSender);

        ReflectionTestUtils.setField(
                emailVerificationService,
                "from",
                "director@panhoramix.com"
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
    void shouldSendVerificationEmailSuccessfully() {
        String recipientEmail = "eric@gmail.com";
        String username = "eric95";
        String verificationToken = "verification-token";

        emailVerificationService.sendVerificationEmail(
                recipientEmail,
                username,
                verificationToken
        );

        verify(mailSender).send(any(SimpleMailMessage.class));

        var captor =
                org.mockito.ArgumentCaptor.forClass(SimpleMailMessage.class);

        verify(mailSender).send(captor.capture());

        SimpleMailMessage message = captor.getValue();

        assertEquals(
                "director@panhoramix.com",
                message.getFrom()
        );

        assertArrayEquals(
                new String[]{recipientEmail},
                message.getTo()
        );

        assertEquals(
                "PHAM — Verify your email",
                message.getSubject()
        );

        assertTrue(
                message.getText().contains(
                        "http://localhost:5173/verify-email?token="
                                + verificationToken
                )
        );

        assertTrue(
                message.getText().contains(username)
        );
    }
}