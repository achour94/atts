package com.atts.tools.msystem.domain.ports.in.usecases;

import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.RegistrationException;
import com.atts.tools.msystem.domain.model.EmailTemplate;
import com.atts.tools.msystem.domain.model.User;

public interface UserManagementUseCase {
    User addUser(Integer clientId, String email) throws RegistrationException;
    void deleteUser(String username) throws RegistrationException;
    EmailTemplate createEmailTemplate(EmailTemplate emailTemplate) throws IlegalRequestException;
    EmailTemplate updateEmailTemplate(EmailTemplate emailTemplate) throws IlegalRequestException;
    void deleteEmailTemplate(Integer templateId);
    void updatePassword(String oldPassword, String newPassword);
}
