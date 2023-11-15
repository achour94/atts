package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.out.UserStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.UserRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserStorageAdapter implements UserStoragePort {

  private final UserRepository userRepository;

  @Override
  public User createUser(User user) {
    return Transformer.transformToUser(userRepository.save(Transformer.transformToUserEntity(user)));
  }

  @Override
  public void deleteUserByUsername(String username) {
    userRepository.deleteUserEntityByUsername(username);
  }
}
