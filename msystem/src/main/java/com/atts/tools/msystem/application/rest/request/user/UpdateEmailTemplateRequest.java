package com.atts.tools.msystem.application.rest.request.user;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UpdateEmailTemplateRequest {
    @NotNull
    Integer emailTemplateId;

    @NotNull
    String name;
    @NotNull
    String content;
    @NotNull
    String userEmail;
}
