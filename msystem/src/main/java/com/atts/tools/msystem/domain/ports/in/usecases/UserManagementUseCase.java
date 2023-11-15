package com.atts.tools.msystem.domain.ports.in.usecases;

import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.domain.model.User;

public interface UserManagementUseCase {
    User addUser(User user) throws RegistrationException;
    void deleteUser(String username) throws RegistrationException;
}
