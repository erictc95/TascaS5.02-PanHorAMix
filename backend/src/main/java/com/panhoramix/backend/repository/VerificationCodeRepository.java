package com.panhoramix.backend.repository;

import com.panhoramix.backend.entity.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode, Long> {
}
