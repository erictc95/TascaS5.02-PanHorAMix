package com.panhoramix.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.panhoramix.backend.dto.request.RegisterRequest;
import com.panhoramix.backend.exception.EmailAlreadyExistsException;
import com.panhoramix.backend.exception.UsernameAlreadyExistsException;
import com.panhoramix.backend.repository.UserRepository;
import com.panhoramix.backend.security.jwt.JwtService;
import com.panhoramix.backend.service.UserService;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.ArgumentMatchers.any;

import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserService userService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;


    @Test
    void shouldRegisterUserSuccessfully() throws Exception {

        RegisterRequest request = RegisterRequest.builder()
                .username("eric95")
                .email("eric@gmail.com")
                .password("12345678")
                .build();

        doNothing()
                .when(userService)
                .register(request);

        mockMvc.perform(
                        post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isCreated());
    }


    @Test
    void shouldReturnBadRequestWhenRequestIsInvalid() throws Exception {

        RegisterRequest request = RegisterRequest.builder()
                .username("")
                .email("invalid-email")
                .password("")
                .build();

        mockMvc.perform(
                        post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isBadRequest());
    }


    @Test
    void shouldReturnConflictWhenEmailAlreadyExists() throws Exception {

        RegisterRequest request = RegisterRequest.builder()
                .username("eric95")
                .email("eric@gmail.com")
                .password("12345678")
                .build();

        doThrow(new EmailAlreadyExistsException())
                .when(userService)
                .register(any(RegisterRequest.class));

        mockMvc.perform(
                        post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code")
                        .value("EMAIL_ALREADY_EXISTS"));
    }


    @Test
    void shouldReturnConflictWhenUsernameAlreadyExists() throws Exception {

        RegisterRequest request = RegisterRequest.builder()
                .username("eric95")
                .email("eric@gmail.com")
                .password("12345678")
                .build();

        doThrow(new UsernameAlreadyExistsException())
                .when(userService)
                .register(any(RegisterRequest.class));

        mockMvc.perform(
                        post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request))
                )
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code")
                        .value("USERNAME_ALREADY_EXISTS"));
    }
}