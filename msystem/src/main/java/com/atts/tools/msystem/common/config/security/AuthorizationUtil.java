package com.atts.tools.msystem.common.config.security;

import com.atts.tools.msystem.domain.model.Role;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class AuthorizationUtil {

    public boolean currentUserIsAdmin() {
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication()
            .getAuthorities();
        return authorities.stream()
            .anyMatch(grantedAuthority -> Role.ADMIN.toAuthority().equals(grantedAuthority.getAuthority()));
    }

    public boolean currentUserIsClient() {
        Collection<? extends GrantedAuthority> authorities = SecurityContextHolder.getContext().getAuthentication()
            .getAuthorities();
        return authorities.stream()
            .anyMatch(grantedAuthority -> Role.CLIENT.toAuthority().equals(grantedAuthority.getAuthority()));
    }

    public String getCurrentUserUsername() {
        return (String) ((Jwt) SecurityContextHolder.getContext().getAuthentication()
            .getCredentials()).getClaims()
            .get("preferred_username");
    }
}
