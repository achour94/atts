package com.atts.tools.msystem.application.rest.response.user;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AddEmailTemplateRequest {
    @NotNull
    String name;
    @NotNull
    String content;
    String email;
}
