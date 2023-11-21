package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils;

import com.atts.tools.msystem.domain.model.User;

public class Transformer {

    private Transformer() {
        //it's a helper class;
    }

    public static com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.User transformToUserEntity(
        User user) {
        com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.User userEntity = new com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.User();
        userEntity.setEmail(user.getEmail());
        userEntity.setUsername(user.getUsername());
        return userEntity;
    }

    public static User transformToUser(
        com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.User userEntity) {
        return User.builder().username(userEntity.getUsername()).id(userEntity.getId()).email(userEntity.getEmail())
            .build();
    }
}
