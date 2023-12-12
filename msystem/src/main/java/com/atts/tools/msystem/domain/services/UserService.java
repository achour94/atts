package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.common.config.security.AuthorizationUtil;
import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.EmailTemplate;
import com.atts.tools.msystem.domain.model.Role;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.in.usecases.UserManagementUseCase;
import com.atts.tools.msystem.domain.ports.out.auth.AuthProvider;
import com.atts.tools.msystem.domain.ports.out.datastore.ClientStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.EmailTemplateStoragePort;
import com.atts.tools.msystem.domain.ports.out.datastore.UserStoragePort;
import com.atts.tools.msystem.domain.ports.out.smtp.EmailPort;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;

@UseCase
@Transactional
@RequiredArgsConstructor
public class UserService implements UserManagementUseCase {

    private final AuthProvider authProvider;
    private final UserStoragePort userStoragePort;
    private final ClientStoragePort clientStoragePort;
    private final EmailTemplateStoragePort emailTemplateStoragePort;
    private final EmailPort emailPort;
    private final AuthorizationUtil authorizationUtil;

    @Override
    public User addUser(Integer clientId, String email) throws RegistrationException {
        User user = new User();
        user.setRoles(List.of(Role.CLIENT));
        Client client = clientStoragePort.findById(clientId).orElseThrow(NoSuchElementException::new);
        if (client.getEmail() == null && email == null) {
            throw new RegistrationException("You should set an email if the client doesn't have one!");
        }
        if (client.getEmail() != null && !client.getEmail().equals(email)) {
            throw new RegistrationException("You cannot have client email different of user email!");
        }
        if (!client.getUsers().isEmpty()) {
            throw new RuntimeException("You can add only one user per client!");
        }
        client.setEmail(email);
        clientStoragePort.save(client);
        user.setClient(client);

        user.setUsername(client.getEmail());
        String temporaryPassword = UUID.randomUUID().toString();
        user.setPassword(temporaryPassword);
        user.setEmail(client.getEmail());
        authProvider.addUser(user);
        try {
            User createdUser = userStoragePort.createUser(user);
            emailPort.sendLoginMailToChangePassword(user.getUsername(), user.getPassword(), user.getEmail());
            return createdUser;
        } catch (Exception e) {
            authProvider.deleteUser(user.getUsername());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteUser(String username) {
        authProvider.deleteUser(username);
        try {
            userStoragePort.deleteUserByUsername(username);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) {
        if (emailTemplate.getId() != null) {
            throw new IllegalStateException("You cannot create an email template that has already an id");
        }
        return emailTemplateStoragePort.save(emailTemplate);
    }

    @Override
    public EmailTemplate updateEmailTemplate(EmailTemplate emailTemplate) {
        if (emailTemplate.getId() != null) {
            throw new IllegalStateException("You cannot update an email template without an id!");
        }
        if (emailTemplateStoragePort.findById(emailTemplate.getId()).isEmpty()) {
            throw new IllegalStateException("You cannot update an email template that doesn't exist!");
        }
        return emailTemplateStoragePort.save(emailTemplate);
    }

    @Override
    public void deleteEmailTemplate(Integer templateId) {
        emailTemplateStoragePort.deleteById(templateId);
    }

    @Override
    public void updatePassword(String oldPassword, String newPassword) {
        User user = User.builder().username(authorizationUtil.getCurrentUserUsername()).password(newPassword).build();
        authProvider.updatePasswordForUser(oldPassword, user);
    }
}
