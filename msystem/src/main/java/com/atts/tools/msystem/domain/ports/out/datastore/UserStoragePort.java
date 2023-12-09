package com.atts.tools.msystem.domain.ports.out.datastore;

import com.atts.tools.msystem.domain.model.User;
import java.util.List;
import java.util.Set;

public interface UserStoragePort {

    User createUser(User user);

    Set<User> findUsersByUsernames(List<String> usernames);

    void addUsers(List<User> users);

    void deleteUserByUsername(String username);

    User findUserByUsername(String username);
}
