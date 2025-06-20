package com.example.skillv.auth;

import com.example.skillv.dtos.TokenDto;
import com.example.skillv.dtos.UrlDto;
import com.example.skillv.dtos.UserInfo;
import com.example.skillv.user.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleRefreshTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.IOException;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class AuthService {
    @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.resourceserver.opaquetoken.client-secret}")
    private String clientSecret;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;

    private final WebClient webClient;
    private final UserService userService;

    public UrlDto generateAuthUrl() {
        String url = new GoogleAuthorizationCodeRequestUrl(
                clientId,
                redirectUri,
                Arrays.asList("email", "profile", "openid")
        )
                .setAccessType("offline")
                .setApprovalPrompt("force")
                .build();

        return new UrlDto(url);
    }

    public TokenDto processAuthCallback(String code) throws IOException {
        // Exchange authorization code for access token
        GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(),
                new GsonFactory(),
                clientId,
                clientSecret,
                code,
                redirectUri
        ).execute();

        String accessToken = tokenResponse.getAccessToken();
        String refreshToken = tokenResponse.getRefreshToken();
        Long expiresInSeconds = tokenResponse.getExpiresInSeconds();

        // Fetch user info from Google
        UserInfo userInfo = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/oauth2/v3/userinfo")
                        .queryParam("access_token", accessToken).build())
                .retrieve()
                .bodyToMono(UserInfo.class)
                .block();

        if (userInfo == null) {
            return null;
        }

        // Create or update user in database
        userService.createOrUpdateUserFromOAuth(
                userInfo.sub(),
                userInfo.email(),
                userInfo.name(),
                userInfo.picture()
        );

        return new TokenDto(
                accessToken,
                refreshToken,
                expiresInSeconds
        );
    }

    //Refresh tokens
    public TokenDto refreshAccessToken(String refreshToken) throws IOException {
        GoogleTokenResponse tokenResponse = new GoogleRefreshTokenRequest(
                new NetHttpTransport(),
                new GsonFactory(),
                refreshToken,
                clientId,
                clientSecret
        ).execute();

        return new TokenDto(
                tokenResponse.getAccessToken(),
                refreshToken,  // Return the same refresh token
                tokenResponse.getExpiresInSeconds()
        );
    }
}