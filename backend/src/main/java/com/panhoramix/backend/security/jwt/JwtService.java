package com.panhoramix.backend.security.jwt;

import com.panhoramix.backend.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateToken(User user) {

        SecretKey key = Keys.hmacShaKeyFor(
                jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8)
        );

        Date now = new Date();

        Date expiration = new Date(
                now.getTime() + jwtProperties.getExpiration()
        );

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("id", user.getId())
                .claim("username", user.getUsername())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();

    }

}
