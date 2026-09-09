package com.panhoramix.backend.service;

import com.panhoramix.backend.dto.request.LoginRequest;
import com.panhoramix.backend.dto.response.LoginResponse;
import com.panhoramix.backend.entity.enums.Role;
import com.panhoramix.backend.exception.InvalidCredentialsException;
import com.panhoramix.backend.security.jwt.JwtService;

import java.time.LocalDateTime;
import java.util.Optional;
import com.panhoramix.backend.dto.request.RegisterRequest;
import com.panhoramix.backend.entity.User;
import com.panhoramix.backend.exception.EmailAlreadyExistsException;
import com.panhoramix.backend.exception.UsernameAlreadyExistsException;
import com.panhoramix.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private EmailVerificationService emailVerificationService;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;




    @Test
    void shouldRegisterUserSuccessfully() {

        RegisterRequest request = RegisterRequest.builder()
                .username("eric95")
                .email("eric@gmail.com")
                .password("12345678")
                .build();

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(userRepository.existsByUsername(request.getUsername()))
                .thenReturn(false);

        when(passwordEncoder.encode(request.getPassword()))
                .thenReturn("encryptedPassword");

        when(emailVerificationService.generateToken(request.getEmail()))
                .thenReturn("verification-token");

        userService.register(request);

        verify(userRepository).save(any(User.class));

        verify(passwordEncoder)
                .encode(request.getPassword());

        verify(emailVerificationService)
                .generateToken(request.getEmail());

        verify(emailVerificationService)
                .sendVerificationEmail(
                        request.getEmail(),
                        request.getUsername(),
                        "verification-token"
                );
    }


    @Test
    void shouldThrowExceptionWhenEmailAlreadyExists() {

        RegisterRequest request = RegisterRequest.builder()
                .username("eric95")
                .email("eric@gmail.com")
                .password("12345678")
                .build();

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(true);

        assertThrows(
                EmailAlreadyExistsException.class,
                () -> userService.register(request)
        );

        verify(userRepository, never()).save(any(User.class));

        verify(emailVerificationService, never())
                .generateToken(anyString());
    }


    @Test
    void shouldThrowExceptionWhenUsernameAlreadyExists() {

        RegisterRequest request = RegisterRequest.builder()
                .username("eric95")
                .email("eric@gmail.com")
                .password("12345678")
                .build();

        when(userRepository.existsByEmail(request.getEmail()))
                .thenReturn(false);

        when(userRepository.existsByUsername(request.getUsername()))
                .thenReturn(true);

        assertThrows(
                UsernameAlreadyExistsException.class,
                () -> userService.register(request)
        );

        verify(userRepository, never()).save(any(User.class));

        verify(emailVerificationService, never())
                .generateToken(anyString());
    }

    @Test
    void shouldLoginUserSuccessfully() {

        LoginRequest request = new LoginRequest();
                request.setEmail("eric@gmail.com");
                request.setPassword("12345678");


        User user = User.builder()
                .id(1L)
                .username("eric95")
                .email("eric@gmail.com")
                .password("encryptedPassword")
                .role(Role.USER)
                .phoneVerifiedAt(LocalDateTime.now())
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )).thenReturn(true);

        when(jwtService.generateToken(user))
                .thenReturn("jwt-token");

        LoginResponse response = userService.login(request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("eric95", response.getUsername());
        assertEquals(Role.USER, response.getRole());
        assertEquals("jwt-token", response.getToken());

        verify(userRepository).findByEmail(request.getEmail());
        verify(passwordEncoder).matches(
                request.getPassword(),
                user.getPassword()
        );
        verify(jwtService).generateToken(user);
    }

    @Test
    void shouldThrowExceptionWhenPasswordIsInvalid() {

        LoginRequest request = new LoginRequest();
                request.setEmail("eric@gmail.com");
                request.setPassword("wrong-password");


        User user = User.builder()
                .id(1L)
                .username("eric95")
                .email("eric@gmail.com")
                .password("encryptedPassword")
                .role(Role.USER)
                .build();

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )).thenReturn(false);

        assertThrows(
                InvalidCredentialsException.class,
                () -> userService.login(request)
        );

        verify(jwtService, never()).generateToken(any(User.class));
    }

    @Test
    void shouldThrowExceptionWhenUserDoesNotExist() {

        LoginRequest request = new LoginRequest();
                request.setEmail("unknown@gmail.com");
                request.setPassword("12345678");


        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.empty());

        assertThrows(
                InvalidCredentialsException.class,
                () -> userService.login(request)
        );

        verify(passwordEncoder, never())
                .matches(anyString(), anyString());

        verify(jwtService, never())
                .generateToken(any(User.class));
    }

    @Test
    void shouldVerifyEmailSuccessfully() {

        String token = "valid-verification-token";
        String email = "eric@gmail.com";

        User user = User.builder()
                .id(1L)
                .username("eric95")
                .email(email)
                .role(Role.USER)
                .phoneVerifiedAt(null)
                .build();

        when(emailVerificationService.isValid(token))
                .thenReturn(true);

        when(emailVerificationService.getEmailFromToken(token))
                .thenReturn(email);

        when(userRepository.findByEmail(email))
                .thenReturn(Optional.of(user));

        userService.verifyEmail(token);

        assertNotNull(user.getPhoneVerifiedAt());
        assertNotNull(user.getUpdatedAt());

        verify(emailVerificationService).isValid(token);
        verify(emailVerificationService).getEmailFromToken(token);
        verify(userRepository).findByEmail(email);
        verify(userRepository).save(user);
    }

    @Test
    void shouldThrowExceptionWhenVerificationTokenIsInvalid() {

        String token = "invalid-verification-token";

        when(emailVerificationService.isValid(token))
                .thenReturn(false);

        assertThrows(
                InvalidCredentialsException.class,
                () -> userService.verifyEmail(token)
        );

        verify(emailVerificationService).isValid(token);

        verify(emailVerificationService, never())
                .getEmailFromToken(anyString());

        verify(userRepository, never())
                .findByEmail(anyString());

        verify(userRepository, never())
                .save(any(User.class));
    }
}