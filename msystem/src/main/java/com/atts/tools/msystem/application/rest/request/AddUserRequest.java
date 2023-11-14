package com.atts.tools.msystem.application.rest.request;

import com.atts.tools.msystem.domain.model.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddUserRequest {
    private String username;
    private String password;

    public User toUser() {
        return User.builder().username(username)
                .password(password).build();
    }
}
