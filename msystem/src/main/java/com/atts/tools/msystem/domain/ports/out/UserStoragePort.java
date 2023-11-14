package com.atts.tools.msystem.domain.ports.out;

import com.atts.tools.msystem.domain.model.User;

public interface UserStoragePort {
  User createUser(User user);
}
