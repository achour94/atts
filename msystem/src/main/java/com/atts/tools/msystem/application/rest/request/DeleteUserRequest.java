package com.atts.tools.msystem.application.rest.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class DeleteUserRequest {
  @NotNull
  private String username;
}
