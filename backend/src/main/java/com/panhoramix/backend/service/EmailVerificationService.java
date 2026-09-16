package com.panhoramix.backend.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;

@Service
public class EmailVerificationService {

    private static final Duration TOKEN_VALIDITY = Duration.ofHours(24);

    private final SecretKey secretKey;
    private final Resend resend;

    @Value("${app.mail.from}")
    private String from;
    @Value("${FRONTEND_URL}")
    private String frontendUrl;

    public EmailVerificationService(
            @Value("${app.email-verification.secret}") String secret,
            @Value("${RESEND_API_KEY}") String resendApiKey
    ) {
        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.resend = new Resend(resendApiKey);
    }

    public String generateToken(String email) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(email)
                .issuedAt(Date.from(now))
                .expiration(Date.from(now.plus(TOKEN_VALIDITY)))
                .signWith(secretKey)
                .compact();
    }

    public String getEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    public void sendVerificationEmail(
            String recipientEmail,
            String username,
            String verificationToken
    ) {
        String verificationUrl =
                frontendUrl
                        + "/verify-email?token="
                        + verificationToken;

        String emailText = """
                Hello %s,

                Welcome to PanHorAMix.

                Please verify your email address by clicking the link below:

                %s

                This verification link will expire in 24 hours.

                If you did not create a PanHorAMix account, you can ignore this email.

                Regards,
                PHAM
                PanHorAMix
                """.formatted(
                username,
                verificationUrl
        );

        CreateEmailOptions params = CreateEmailOptions.builder()
                .from(from)
                .to(recipientEmail)
                .subject("PHAM — Verify your email")
                .text(emailText)
                .build();

        try {
            resend.emails().send(params);
        } catch (ResendException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    public boolean isValid(String token) {
        try {
            getEmailFromToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}