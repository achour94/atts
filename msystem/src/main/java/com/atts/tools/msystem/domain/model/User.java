package com.atts.tools.msystem.domain.model;

import com.fasterxml.jackson.annotation.JsonProperty;
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
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User implements ModelEntity {

    @JsonProperty("userId")
    private Integer id;
    private Client client;
    private List<Role> roles;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String password;
    @Builder.Default
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
        return Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(email);
    }
}
