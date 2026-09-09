package com.panhoramix.backend.security.jwt;

import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.entity.enums.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.junit.jupiter.api.extension.ExtendWith;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    @Mock
    private JwtProperties jwtProperties;

    @InjectMocks
    private JwtService jwtService;

    private User user;

    @BeforeEach
    void setUp() {

        when(jwtProperties.getSecret())
                .thenReturn("this-is-a-test-secret-key-that-is-long-enough");

        user = User.builder()
                .id(1L)
                .username("eric95")
                .email("eric@gmail.com")
                .role(Role.USER)
                .build();
    }

    @Test
    void shouldGenerateTokenSuccessfully() {

        when(jwtProperties.getExpiration())
                .thenReturn(3600000L);

        String token = jwtService.generateToken(user);

        assertNotNull(token);
    }

    @Test
    void shouldExtractEmailFromToken() {

        when(jwtProperties.getExpiration())
                .thenReturn(3600000L);

        String token = jwtService.generateToken(user);

        String email = jwtService.extractEmail(token);

        assertEquals("eric@gmail.com", email);
    }

    @Test
    void shouldReturnTrueWhenTokenIsValid() {

        when(jwtProperties.getExpiration())
                .thenReturn(3600000L);

        String token = jwtService.generateToken(user);

        assertTrue(jwtService.isTokenValid(token));
    }

    @Test
    void shouldReturnFalseWhenTokenIsInvalid() {

        assertFalse(jwtService.isTokenValid("invalid-token"));
    }
}
