package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.common.config.security.AuthorizationUtil;
import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.RegistrationException;
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
    public User addUser(Integer clientId, User user) throws RegistrationException {
        user.setRoles(List.of(Role.CLIENT));
        Client client = clientStoragePort.findById(clientId).orElseThrow(NoSuchElementException::new);

        if (!client.getUsers().isEmpty()) {
            throw new RegistrationException("You can add only one user per client!");
        }
        user.setClient(client);

        String temporaryPassword = UUID.randomUUID().toString();
        user.setPassword(temporaryPassword);
        authProvider.addUser(user);
        try {
            User createdUser = userStoragePort.createUser(user);
            emailPort.sendLoginMailToChangePassword(user.getEmail(), user.getPassword(), user.getEmail());
            return createdUser;
        } catch (Exception e) {
            authProvider.deleteUser(user.getEmail());
            throw new RuntimeException(e);
        }
    }

    @Override
    public void deleteUser(String username) {
        //TODO to see if we can use the keycloak to do this
        authProvider.deleteUser(username);
        try {
            userStoragePort.deleteUserByUsername(username);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) throws IlegalRequestException {
        if (emailTemplate.getId() != null) {
            throw new IlegalRequestException("You cannot create an email template that has already an id");
        }
        return emailTemplateStoragePort.save(emailTemplate);
    }

    @Override
    public EmailTemplate updateEmailTemplate(EmailTemplate emailTemplate) throws IlegalRequestException {
        if (emailTemplate.getId() == null) {
            throw new IlegalRequestException("You cannot update an email template without an id!");
        }
        if (emailTemplateStoragePort.findById(emailTemplate.getId()).isEmpty()) {
            throw new IlegalRequestException("You cannot update an email template that doesn't exist!");
        }
        return emailTemplateStoragePort.save(emailTemplate);
    }

    @Override
    public void deleteEmailTemplate(Integer templateId) {
        emailTemplateStoragePort.deleteById(templateId);
    }

    @Override
    public void updatePassword(String oldPassword, String newPassword) {
        User user = User.builder().email(authorizationUtil.getCurrentUserUsername()).password(newPassword).build();
        authProvider.updatePasswordForUser(oldPassword, user);
    }
}
