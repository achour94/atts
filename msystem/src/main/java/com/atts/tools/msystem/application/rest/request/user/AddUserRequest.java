package com.atts.tools.msystem.application.rest.request.user;

import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.User;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddUserRequest {
    @NotNull
    private Integer clientId;
    private String email; //email that will be set for client if it doesn't exists
}
