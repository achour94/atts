package com.atts.tools.msystem.application.rest.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PasswordUpdateRequest {
    String oldPassword;
    @NotNull
    String newPassword;
}
