package com.example.employeemanagement.controller;

import com.example.employeemanagement.dto.LoginRequestDTO;
import com.example.employeemanagement.dto.LoginResponseDTO;
import com.example.employeemanagement.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Bonus: JWT authentication.
 *
 * A single demo admin account (configured via ADMIN_USERNAME / ADMIN_PASSWORD
 * environment variables, defaulting to admin / admin123) is enough to satisfy
 * the assignment's "secure the API + add a login page" bonus task without
 * introducing a full user-management subsystem that isn't part of the spec.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoderRef;
    private final String adminUsername;
    private final String encodedAdminPassword;
    private final long expirationMs;

    public AuthController(
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder,
            @Value("${app.auth.admin-username}") String adminUsername,
            @Value("${app.auth.admin-password}") String adminPassword,
            @Value("${app.jwt.expiration-ms}") long expirationMs) {
        this.jwtUtil = jwtUtil;
        this.passwordEncoderRef = passwordEncoder;
        this.adminUsername = adminUsername;
        this.encodedAdminPassword = passwordEncoder.encode(adminPassword);
        this.expirationMs = expirationMs;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO request) {
        boolean usernameMatches = adminUsername.equalsIgnoreCase(request.getUsername());
        boolean passwordMatches = usernameMatches
                && passwordEncoderRef.matches(request.getPassword(), encodedAdminPassword);

        if (!usernameMatches || !passwordMatches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of(
                            "timestamp", java.time.LocalDateTime.now().toString(),
                            "status", 401,
                            "error", "Unauthorized",
                            "message", "Invalid username or password"
                    ));
        }

        String token = jwtUtil.generateToken(adminUsername);

        LoginResponseDTO response = LoginResponseDTO.builder()
                .token(token)
                .username(adminUsername)
                .expiresInMs(expirationMs)
                .build();

        return ResponseEntity.ok(response);
    }
}
