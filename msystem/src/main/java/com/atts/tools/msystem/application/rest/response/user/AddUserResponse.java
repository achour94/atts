package com.atts.tools.msystem.application.rest.response.user;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Builder
public class AddUserResponse {
  private Integer id;
  private String username;
}
