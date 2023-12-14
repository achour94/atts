package com.atts.tools.msystem.domain.model;

import java.util.ArrayList;
import java.util.Objects;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class User implements ModelEntity {

    private Integer id;
    private Client client;
    private List<Role> roles;
    private String email;
    private String username;
    private String password;
    private List<EmailTemplate> emailTemplates = new ArrayList<>();
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
