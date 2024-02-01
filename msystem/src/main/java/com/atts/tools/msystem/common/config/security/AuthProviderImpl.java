package com.atts.tools.msystem.common.config.security;

import com.atts.tools.msystem.common.exceptions.types.RegistrationException;
import com.atts.tools.msystem.domain.model.Role;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.out.auth.AuthProvider;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.*;
import org.keycloak.representations.idm.ClientRepresentation;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class AuthProviderImpl implements AuthProvider {

    private static final Logger LOG = LoggerFactory.getLogger(AuthProviderImpl.class);

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    private CredentialRepresentation createPasswordCredentials(String password) {
        CredentialRepresentation passwordCredentials = new CredentialRepresentation();
        passwordCredentials.setTemporary(false);
        passwordCredentials.setType(CredentialRepresentation.PASSWORD);
        passwordCredentials.setValue(password);
        return passwordCredentials;
    }

    @Override
    public void addUser(User registrationUser) throws RegistrationException {
        RealmResource realmResource = this.keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();
        CredentialRepresentation credentialRepresentation = createPasswordCredentials(registrationUser.getPassword());

        UserRepresentation user = new UserRepresentation();
        user.setUsername(registrationUser.getEmail());
        user.setEmail(user.getEmail());
        user.setEnabled(true);
        user.setCredentials(Collections.singletonList(credentialRepresentation));

        Response response = usersResource.create(user);
        if (response.getStatus() != 201) {
            if (Response.Status.CONFLICT.equals(response.getStatusInfo())) {
                throw new RegistrationException("An user with the same username already exists");
            } else {
                throw new RuntimeException(response.getStatusInfo().getReasonPhrase());
            }
        }

        String userId = CreatedResponseUtil.getCreatedId(response);
        UserResource createdUserResource = usersResource.get(userId);

        try {
            ClientRepresentation clientRepresentation = realmResource.clients().findByClientId(clientId).get(0);
            RolesResource rolesResource = realmResource.clients().get(clientRepresentation.getId()).roles();
            List<RoleRepresentation> userRoles = registrationUser.getRoles().stream()
                .map(role -> rolesResource.get(role.getLabel()).toRepresentation()).collect(Collectors.toList());
            createdUserResource.roles().clientLevel(clientRepresentation.getId()).add(userRoles);
        } catch (Exception e) {
            usersResource.delete(userId);
            throw new RuntimeException(e);
        }


    }

    private RoleResource getRoleRepresentation(Role role) {
        RealmResource realmResource = this.keycloak.realm(realm);
        ClientRepresentation clientRepresentation = realmResource.clients().findByClientId(clientId).get(0);
        return realmResource.clients().get(clientRepresentation.getId()).roles().get(role.getLabel());
    }


    @Override
    public void deleteUser(String email) throws IllegalStateException {
        RealmResource realmResource = this.keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();
        UserRepresentation userRepresentation = usersResource.search(email).stream().findAny().orElse(null);
        if (userRepresentation == null) {
            throw new IllegalStateException("There isn't an account with usnername: " + email);
        }
        Response response = usersResource.delete(userRepresentation.getId());
        if (!Status.NO_CONTENT.equals(response.getStatusInfo())) {
            throw new RuntimeException(
                String.format("There was a problem at deleting account for user [%s]!", email));
        }
    }

    @Override
    public List<User> findAllAdminUsers() {
        return getRoleRepresentation(Role.ADMIN).getUserMembers().stream().map(
            userRepresentation -> User.builder().email(userRepresentation.getUsername())
                .email(userRepresentation.getEmail()).build()
        ).collect(Collectors.toList());
    }

    @Override
    public void updatePasswordForUser(String oldPassword, User newUser) {
        RealmResource realmResource = this.keycloak.realm(realm);
        UsersResource usersResource = realmResource.users();
        UserRepresentation userRepresentation = usersResource.search(newUser.getEmail()).stream().findAny()
            .orElseThrow(NoSuchElementException::new);
        UserResource userResource = usersResource.get(userRepresentation.getId());
        CredentialRepresentation passwordCredential = new CredentialRepresentation();
        passwordCredential.setType(CredentialRepresentation.PASSWORD);
        passwordCredential.setValue(newUser.getPassword());
        userResource.resetPassword(passwordCredential);
    }
}
