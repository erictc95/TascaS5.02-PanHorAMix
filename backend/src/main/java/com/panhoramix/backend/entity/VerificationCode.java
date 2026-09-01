package com.panhoramix.backend.entity;

import com.panhoramix.backend.entity.enums.VerificationPurpose;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "verification_codes")

public class VerificationCode {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @Column(name = "code_hash", nullable = false, length = 255)
        private String codeHash;

        @Enumerated(EnumType.STRING)
        @Column(nullable = false, length = 30)
        private VerificationPurpose purpose;

        @Column(name = "target_phone", length = 30)
        private String targetPhone;

        @Column(name = "expires_at", nullable = false)
        private LocalDateTime expiresAt;

        @Column(nullable = false)
        private Integer attempts = 0;

        @Column(name = "used_at")
        private LocalDateTime usedAt;

        @Column(name = "created_at", nullable = false)
        private LocalDateTime createdAt;

    }
