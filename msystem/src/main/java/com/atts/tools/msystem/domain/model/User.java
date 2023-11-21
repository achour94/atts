package com.atts.tools.msystem.domain.model;

import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class User {

    private Integer id;
    private List<Role> roles;
    private String email;
    private String username;
    private String password;
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        User user = (User) o;
        return Objects.equals(email, user.email) && Objects.equals(username,
            user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, email);
    }
}
