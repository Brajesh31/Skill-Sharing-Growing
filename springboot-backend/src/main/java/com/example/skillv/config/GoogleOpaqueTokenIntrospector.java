package com.example.skillv.config;

import com.example.skillv.dtos.UserInfo;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatusCode;
import org.springframework.security.oauth2.core.OAuth2AuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.BadOpaqueTokenException;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionAuthenticatedPrincipal;
import org.springframework.security.oauth2.server.resource.introspection.OAuth2IntrospectionException;
import org.springframework.security.oauth2.server.resource.introspection.OpaqueTokenIntrospector;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
//comment
import java.util.HashMap;
import java.util.Map;

@AllArgsConstructor
public class GoogleOpaqueTokenIntrospector implements OpaqueTokenIntrospector {
    private final WebClient webClient;

    @Override
    public OAuth2AuthenticatedPrincipal introspect(String token) {
        // Get user info from Google
        UserInfo userInfo = webClient.get()
                .uri(uriBuilder -> uriBuilder.path("/oauth2/v3/userinfo")
                        .queryParam("access_token", token)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::is4xxClientError, response ->
                        Mono.error(new BadOpaqueTokenException("Invalid token or token expired")))
                .onStatus(HttpStatusCode::is5xxServerError, response ->
                        Mono.error(new OAuth2IntrospectionException("Error communicating with the introspection endpoint")))
                .bodyToMono(UserInfo.class)
                .block();

        //attributes map
        Map<String, Object> attributes = new HashMap<>();
        attributes.put("sub", userInfo.sub());
        attributes.put("name", userInfo.name());
        attributes.put("given_name", userInfo.given_name());
        attributes.put("family_name", userInfo.family_name());
        attributes.put("picture", userInfo.picture());
        attributes.put("email", userInfo.email());
        attributes.put("email_verified", userInfo.email_verified());
        attributes.put("locale", userInfo.locale());
        attributes.put("hd", userInfo.hd());

        return new OAuth2IntrospectionAuthenticatedPrincipal(userInfo.name(), attributes, null);


    }
}
