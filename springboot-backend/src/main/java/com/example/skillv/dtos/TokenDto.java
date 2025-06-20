package com.example.skillv.dtos;

public record TokenDto(
        String accessToken,
        String refreshToken,
        Long expiresIn
) {
}
