package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.application.rest.request.user.AddUserRequest;
import com.atts.tools.msystem.application.rest.request.user.DeleteUserRequest;
import com.atts.tools.msystem.application.rest.response.user.AddUserResponse;
import com.atts.tools.msystem.common.exceptions.RegistrationException;
import com.atts.tools.msystem.common.runners.AdminsLoader;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.in.usecases.UserManagementUseCase;
import com.atts.tools.msystem.domain.ports.out.UserCriteriaPort;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

  private final UserManagementUseCase userManagementUseCase;
  private final AdminsLoader adminsLoader;
  private final UserCriteriaPort userCriteriaPort;

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

  @PutMapping("/admins")
  @PreAuthorize("hasRole('admin')")
  public void updateAdmins() throws Exception {
      adminsLoader.run(new DefaultApplicationArguments());
      logger.info("Admins list was updated into database!");
  }

  @GetMapping("/")
  @PreAuthorize("hasRole('admin')")
  public ResponseEntity<Page<User>> getUsers(RequestPage page, SearchCriteria criteria) {
    return ResponseEntity.ok(userCriteriaPort.findAllWithFilters(page, criteria));
  }
}
