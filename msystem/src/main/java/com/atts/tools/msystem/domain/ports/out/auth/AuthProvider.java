package com.atts.tools.msystem.domain.ports.out.auth;

import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.domain.model.User;
import java.util.List;

public interface AuthProvider {
    void addUser(User registrationUser) throws RegistrationException;
    void deleteUser(String username) throws IllegalStateException;
    List<User> findAllAdminUsers();
    void updatePasswordForUser(String oldPassword, User newUser);
}
