package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.application.rest.request.AddUserRequest;
import com.atts.tools.msystem.application.rest.request.DeleteUserRequest;
import com.atts.tools.msystem.application.rest.response.AddUserResponse;
import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.in.usecases.UserManagementUseCase;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

  private final UserManagementUseCase userManagementUseCase;

  Logger logger = LoggerFactory.getLogger(UserController.class);

  @PostMapping("/add")
  @PreAuthorize("hasRole('admin')")
  public ResponseEntity<AddUserResponse> addUser(@Valid @RequestBody AddUserRequest request) throws RegistrationException {
    User user = userManagementUseCase.addUser(request.toUser());
    logger.info(String.format("An user with the username: %s was created!", user.getUsername()));
    return ResponseEntity.ok().body(AddUserResponse.builder()
        .username(user.getUsername()).id(user.getId()).build());
  }

  @PutMapping("/delete")
  @PreAuthorize("hasRole('admin')")
  public void deleteUser(@Valid @RequestBody DeleteUserRequest request) throws RegistrationException {
    userManagementUseCase.deleteUser(request.getUsername());
    logger.info(String.format("An user with the username: %s was deleted", request.getUsername()));
  }

  @GetMapping("/")
  public String helloGet() {
    int x = 1;
    return "hello";
  }
}
