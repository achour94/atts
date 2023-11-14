package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils;

import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.UserEntity;

public class Transformer {
  private Transformer() {
    //it's a helper class;
  }

  public static UserEntity transformToUserEntity(User user) {
    UserEntity userEntity = new UserEntity();
    userEntity.setEmail(user.getEmail());
    userEntity.setUsername(user.getUsername());
    return userEntity;
  }

  public static User transformToUser(UserEntity userEntity) {
    return User.builder().username(userEntity.getUsername()).id(userEntity.getId()).build();
  }
}
