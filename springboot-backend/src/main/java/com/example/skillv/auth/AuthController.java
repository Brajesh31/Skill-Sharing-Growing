package com.example.skillv.auth;

import com.example.skillv.dtos.TokenDto;
import com.example.skillv.dtos.UrlDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @GetMapping("/url")
    public ResponseEntity<UrlDto> auth() {
        return ResponseEntity.ok(authService.generateAuthUrl());
    }

    @GetMapping("/callback")
    public ResponseEntity<TokenDto> authCallback(@RequestParam("code") String code) {
        try {
            TokenDto tokenDto = authService.processAuthCallback(code);
            if (tokenDto == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.ok(tokenDto);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenDto> refreshToken(@RequestParam("refresh_token") String refreshToken) {
        try {
            TokenDto tokenDto = authService.refreshAccessToken(refreshToken);
            if (tokenDto == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            return ResponseEntity.ok(tokenDto);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}