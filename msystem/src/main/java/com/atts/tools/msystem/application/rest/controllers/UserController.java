package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.application.rest.request.AddUserRequest;
import com.atts.tools.msystem.application.rest.response.AddUserResponse;
import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.in.usecases.UserManagementUseCase;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

  private final UserManagementUseCase userManagementUseCase;

  @PostMapping("/add")
  @PreAuthorize("hasRole('admin')")
  public ResponseEntity<AddUserResponse> addUser(@RequestBody AddUserRequest request) throws RegistrationException {
    //TODO handle the errors using ControllerAdvice
    User user = userManagementUseCase.addUser(request.toUser());
    return ResponseEntity.ok().body(AddUserResponse.builder()
        .username(user.getUsername()).id(user.getId()).build());
  }

  @GetMapping("/")
  public String helloGet() {
    int x = 1;
    return "hello";
  }
}
