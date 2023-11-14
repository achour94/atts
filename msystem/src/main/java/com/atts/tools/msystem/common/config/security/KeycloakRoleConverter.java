package com.atts.tools.msystem.common.config.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

  @Value("${keycloak.client-id}")
  private String clientId;

  private Object getClaim(List<String> path, Jwt jwt) {
    if (path.isEmpty()) {
      return null;
    }
    if (path.size() == 1) {
      return jwt.getClaim(path.get(0));
    }
    Map<String, Object> current = (Map<String, Object>) jwt.getClaim(path.get(0));
    for (int i = 1; i < path.size() - 1; ++i) {
      current = (Map<String, Object>) current.get(path.get(i));
    }
    return current.get(path.get(path.size() - 1));
  }

  @Override
  public Collection<GrantedAuthority> convert(Jwt jwt) {
    List<String> roles = (List<String>) getClaim(List.of("resource_access", clientId, "roles"), jwt);

    Collection<GrantedAuthority> returnValue = roles.stream().map(roleName -> "ROLE_" + roleName)
        .map(SimpleGrantedAuthority::new).collect(Collectors.toList());

    return returnValue;
  }

}
