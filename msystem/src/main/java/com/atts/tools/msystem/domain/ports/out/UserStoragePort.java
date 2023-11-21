package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.domain.model.User;
import java.util.List;
import java.util.Set;

public interface UserStoragePort {
  User createUser(User user);
  Set<User> findUsersByUsernames(List<String> usernames);
  void addUsers(List<User> users);
  void deleteUserByUsername(String username);
}
