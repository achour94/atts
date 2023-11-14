package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.domain.model.User;

public interface AuthProvider {
    void addUser(User registrationUser) throws RegistrationException;
    void deleteUser(User registeredUser) throws RegistrationException;
}
