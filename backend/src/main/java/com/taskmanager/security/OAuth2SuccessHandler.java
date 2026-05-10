package com.taskmanager.security;
import com.taskmanager.entity.User;
import com.taskmanager.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.util.Optional;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    public OAuth2SuccessHandler(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            UserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            org.springframework.security.core.Authentication authentication
    ) throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;

        String provider = oauthToken.getAuthorizedClientRegistrationId().toUpperCase();
        Map<String, Object> attrs = oauthToken.getPrincipal().getAttributes();

        String email = provider.equals("GITHUB")
                ? (String) attrs.get("email")
                : (String) attrs.get("email");

        String name = provider.equals("GITHUB")
                ? (String) attrs.getOrDefault("login", "GitHub User")
                : (String) attrs.getOrDefault("name", "Google User");

        String providerId = String.valueOf(attrs.get("id") != null ? attrs.get("id") : attrs.get("sub"));

        User.Role selectedRole = getRoleFromCookie(request);

        String authMode = getAuthModeFromCookie(request);
        Optional<User> existingUser = userRepository.findByEmail(email);

        if ("SIGNUP".equals(authMode) && existingUser.isPresent()) {
            String redirectUrl = frontendUrl + "/signup?error=user_exists";
            response.sendRedirect(redirectUrl);
            return;
        }

        if ("LOGIN".equals(authMode) && existingUser.isEmpty()) {
            String redirectUrl = frontendUrl + "/login?error=user_not_registered";
            response.sendRedirect(redirectUrl);
            return;
        }

        User user = existingUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setPassword("OAUTH2_USER");
            newUser.setRole(selectedRole);
            newUser.setProvider(provider);
            newUser.setProviderId(providerId);
            return userRepository.save(newUser);
        });

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtUtil.generateToken(userDetails);

        String redirectUrl = frontendUrl + "/oauth-success?token=" +
                URLEncoder.encode(token, StandardCharsets.UTF_8);

        response.sendRedirect(redirectUrl);
    }

    private User.Role getRoleFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return User.Role.MEMBER;

        for (Cookie cookie : request.getCookies()) {
            if ("TF_ROLE".equals(cookie.getName())) {
                try {
                    return User.Role.valueOf(cookie.getValue().toUpperCase());
                } catch (Exception ignored) {
                    return User.Role.MEMBER;
                }
            }
        }
        return User.Role.MEMBER;
    }

    private String getAuthModeFromCookie(HttpServletRequest request) {
        if (request.getCookies() == null) return "LOGIN";

        for (Cookie cookie : request.getCookies()) {
            if ("TF_AUTH_MODE".equals(cookie.getName())) {
                String value = cookie.getValue();
                if ("SIGNUP".equalsIgnoreCase(value)) return "SIGNUP";
                if ("LOGIN".equalsIgnoreCase(value)) return "LOGIN";
            }
        }

        return "LOGIN";
    }
}