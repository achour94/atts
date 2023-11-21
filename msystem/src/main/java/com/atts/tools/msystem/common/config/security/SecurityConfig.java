package com.atts.tools.msystem.common.config.security;

import com.nimbusds.jose.shaded.gson.internal.LinkedTreeMap;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.EnableAspectJAutoProxy;
import org.springframework.core.annotation.Order;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;


import org.springframework.security.core.session.SessionRegistryImpl;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.RegisterSessionAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;


import java.util.*;
import java.util.stream.Collectors;

@Configuration
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

//    private final KeycloakLogoutHandler keycloakLogoutHandler;
    private final KeycloakRoleConverter keycloakRoleConverter;

    @Value("${keycloak.url}")
    private String keyclockUrl;
    @Value("${keycloak.realm}")
    private String keycloakRealm;
    @Value("${keycloak.client-id}")
    private String keycloakClientId;
    @Value("${keycloak.client-secret}")
    private String keycloakClientSecret;

    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
        //TODO fix csrf problem before deploy
        http.csrf(csrfConf -> csrfConf.disable());
        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(keycloakRoleConverter);
        http.oauth2ResourceServer(oauth2Conf -> oauth2Conf.jwt(jwtConfigurer -> jwtConfigurer.jwtAuthenticationConverter(jwtAuthenticationConverter)));


        http
                .authorizeHttpRequests(httpConfig -> httpConfig
                        .anyRequest().authenticated())
               .cors(corsCustomizer -> corsCustomizer.configurationSource(request -> {
                   CorsConfiguration config = new CorsConfiguration();
                   config.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
                   config.setAllowedMethods(Collections.singletonList("*"));
                   config.setAllowCredentials(true);
                   config.setAllowedHeaders(Collections.singletonList("*"));
                   return config;
               })) .oauth2ResourceServer(oauth2ResourceServerCustomizer ->
                       oauth2ResourceServerCustomizer.jwt(jwtCustomizer -> jwtCustomizer.jwtAuthenticationConverter(jwtAuthenticationConverter)));
        return http.build();

    }


    @Bean
    public Keycloak keycloak() {

        return KeycloakBuilder.builder()
                .serverUrl(keyclockUrl)
//                .realm("master")
//                .grantType(OAuth2Constants.PASSWORD)
//                .username(ke)
//                .password("admin")
                .clientId("admin-cli")
                .realm("master")
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
//                .username("admin")
//                .password("admin")
                .clientSecret("KwcliaYCQSAvlgN7klYWDo9O0htA0UQu")
//                .clientId(keycloakClientId)
                .build();
    }

}
