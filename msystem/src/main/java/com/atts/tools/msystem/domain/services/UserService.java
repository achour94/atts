package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.application.rest.request.user.UpdateEmailTemplateRequest;
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
import java.util.Optional;
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
        User userWithSameEmail = userStoragePort.findUserByUsername(user.getEmail());
        if (userWithSameEmail != null && userWithSameEmail.getClient() != null && !userWithSameEmail.getClient().getId()
            .equals(clientId)) {
            throw new RegistrationException("You cannot assign a user to another client!");
        }
        Optional<User> userToDelete = client.getUsers().stream()
            .filter(clientUser -> !user.getEmail().equals(clientUser.getEmail())).findAny();
        if (userToDelete.isPresent() || client.getUsers().isEmpty()) {
            userToDelete.ifPresent(us -> deleteUser(us.getEmail()));
            user.setClient(client);

            String temporaryPassword = UUID.randomUUID().toString();
            user.setPassword(temporaryPassword);
            authProvider.addUser(user);
            try {
                User createdUser = userStoragePort.save(user);
                emailPort.sendLoginMailToChangePassword(user.getEmail(), user.getPassword(), user.getEmail());
                return createdUser;
            } catch (Exception e) {
                authProvider.deleteUser(user.getEmail());
                throw new RuntimeException(e);
            }
        } else {
            User userToUpdate = client.getUsers().stream().filter(us -> us.getEmail().equals(user.getEmail())).findAny().get();
            userToUpdate.setLastName(user.getLastName());
            userToUpdate.setFirstName(user.getLastName());
            userToUpdate.setPhoneNumber(user.getPhoneNumber());
            return userStoragePort.save(userToUpdate);
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
    public EmailTemplate updateEmailTemplate(UpdateEmailTemplateRequest emailTemplate) throws IlegalRequestException {
        if (emailTemplate.getEmailTemplateId() == null) {
            throw new IlegalRequestException("You cannot update an email template without an id!");
        }
        if (emailTemplateStoragePort.findById(emailTemplate.getEmailTemplateId()).isEmpty()) {
            throw new IlegalRequestException("You cannot update an email template that doesn't exist!");
        }
        EmailTemplate emailTemplateToUpdate = EmailTemplate.builder().id(emailTemplate.getEmailTemplateId())
            .content(emailTemplate.getContent()).name(emailTemplate.getName()).user(userStoragePort.findUserByUsername(
                emailTemplate.getUserEmail())).build();
        return emailTemplateStoragePort.save(emailTemplateToUpdate);
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
