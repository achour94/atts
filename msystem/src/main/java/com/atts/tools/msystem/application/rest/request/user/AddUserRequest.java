package com.atts.tools.msystem.application.rest.request.user;

import com.atts.tools.msystem.domain.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddUserRequest {
    @NotNull
    private String username;
    @NotNull
    private String password;
    @NotNull
    private String email;

    public User toUser() {
        return User.builder().username(username)
                .password(password).email(email).build();
    }
}
