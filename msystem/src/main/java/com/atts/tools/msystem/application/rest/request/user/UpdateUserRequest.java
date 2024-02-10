package com.atts.tools.msystem.application.rest.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    @NotNull
    private String firstName;
    @NotNull
    private String lastName;
    @NotNull
    private String phoneNumber;
    @NotNull
    private String email;
}
