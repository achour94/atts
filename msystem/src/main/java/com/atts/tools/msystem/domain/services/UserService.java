package com.atts.tools.msystem.domain.services;

import com.atts.tools.msystem.common.annotations.UseCase;
import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.domain.model.Role;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.in.usecases.UserManagementUseCase;
import com.atts.tools.msystem.domain.ports.out.AuthProvider;
import com.atts.tools.msystem.domain.ports.out.UserStoragePort;
import java.util.List;
import lombok.RequiredArgsConstructor;

@UseCase
@RequiredArgsConstructor
public class UserService implements UserManagementUseCase {

  private final AuthProvider authProvider;
  private final UserStoragePort userStoragePort;

  @Override
  public User addUser(User user) throws RegistrationException {
    user.setRoles(List.of(Role.CLIENT));
    authProvider.addUser(user);
    try {
      return userStoragePort.createUser(user);
    } catch (Exception e) {
      authProvider.deleteUser(user.getUsername());
      throw new RuntimeException(e);
    }
  }

  @Override
  public void deleteUser(String username) {
    User user = authProvider.deleteUser(username);
    try {
      userStoragePort.deleteUserByUsername(username);
    } catch (Exception e) {
      try {
        addUser(user);
      } catch (RegistrationException ex) {
        //do nothing
      }
      throw new RuntimeException(e);
    }
  }
}
