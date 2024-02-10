package com.atts.tools.msystem.application.rest.controllers;

import com.atts.tools.msystem.application.rest.request.user.AddUserRequest;
import com.atts.tools.msystem.application.rest.request.user.DeleteUserRequest;
import com.atts.tools.msystem.application.rest.request.user.PasswordUpdateRequest;
import com.atts.tools.msystem.application.rest.request.user.UpdateUserRequest;
import com.atts.tools.msystem.application.rest.response.user.AddUserResponse;
import com.atts.tools.msystem.common.config.security.AuthorizationUtil;
import com.atts.tools.msystem.common.exceptions.types.IlegalRequestException;
import com.atts.tools.msystem.common.exceptions.types.NotFoundElementException;
import com.atts.tools.msystem.common.exceptions.types.RegistrationException;
import com.atts.tools.msystem.common.runners.AdminsLoader;
import com.atts.tools.msystem.domain.model.EmailTemplate;
import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.ports.in.usecases.UserManagementUseCase;
import com.atts.tools.msystem.domain.ports.out.datastore.UserCriteriaPort;
import com.atts.tools.msystem.domain.ports.out.datastore.UserStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria.CriteriaMapper;

import jakarta.validation.Valid;
import java.util.List;
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
    private final UserStoragePort userStoragePort;
    private final CriteriaMapper criteriaMapper;
    private final AuthorizationUtil authorizationUtil;
    Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/add")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<AddUserResponse> addUser(@Valid @RequestBody AddUserRequest request)
        throws RegistrationException {
        User user = userManagementUseCase.addUser(request.getClientId(),
            User.builder().email(request.getEmail()).firstName(request.getFirstName()).lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber()).build());
        logger.info(String.format("An user with the username: %s was created!", user.getEmail()));
        return ResponseEntity.ok().body(AddUserResponse.builder()
            .username(user.getEmail()).id(user.getId()).build());
    }

    @PutMapping("/")
    @PreAuthorize("@securityService.hasPermission('USER', #updateUserRequest.email)")
    public User updateUser(@Valid @RequestBody UpdateUserRequest updateUserRequest) throws NotFoundElementException {
        User user = userStoragePort.findUserByUsername(updateUserRequest.getEmail());
        if (user == null) {
            throw new NotFoundElementException("There isn't an user with email " + updateUserRequest.getEmail());
        }
        user.setPhoneNumber(updateUserRequest.getPhoneNumber());
        user.setFirstName(updateUserRequest.getFirstName());
        user.setLastName(updateUserRequest.getLastName());
        return userStoragePort.save(user);
    }

    @GetMapping("/{email}")
    public User getUser(@PathVariable String email) {
        return userStoragePort.findUserByUsername(email);
    }

    @PutMapping("/password")
    public void updatePassword(@RequestBody PasswordUpdateRequest request) {
        userManagementUseCase.updatePassword(request.getOldPassword(), request.getNewPassword());
    }

    @PutMapping("/delete")
    @PreAuthorize("hasRole('admin')")
    public void deleteUser(@Valid @RequestBody DeleteUserRequest request) throws RegistrationException {
        userManagementUseCase.deleteUser(request.getUsername());
        logger.info(String.format("An user with the username: %s was deleted", request.getUsername()));
    }

    @PostMapping("/emailtemplate")
    public ResponseEntity<EmailTemplate> addEmailTemplate(@RequestBody EmailTemplate emailTemplate)
        throws IlegalRequestException {
        return ResponseEntity.ok(userManagementUseCase.createEmailTemplate(emailTemplate));
    }

    @GetMapping("/emailtemplate")
    public ResponseEntity<List<EmailTemplate>> getEmailTemplates() {
        return ResponseEntity.ok(
            userStoragePort.findUserByUsername(authorizationUtil.getCurrentUserUsername()).getEmailTemplates());
    }

    @PutMapping("/emailtemplate")
    @PreAuthorize("@securityService.hasPermission('EMAIL_TEMPLATE', #emailTemplate)")
    public ResponseEntity<EmailTemplate> updateEmailTemplate(@Valid @RequestBody EmailTemplate emailTemplate)
        throws IlegalRequestException {
        return ResponseEntity.ok(userManagementUseCase.updateEmailTemplate(emailTemplate));
    }

    @DeleteMapping("/emailtemplate/{emailTemplateId}")
    @PreAuthorize("@securityService.hasPermission('EMAIL_TEMPLATE', #emailTemplateId)")
    public void deleteEmailTemplate(@PathVariable Integer emailTemplateId) {
        userManagementUseCase.deleteEmailTemplate(emailTemplateId);
    }

    @PutMapping("/admins")
    @PreAuthorize("hasRole('admin')")
    public void updateAdmins() throws Exception {
        adminsLoader.run(new DefaultApplicationArguments());
        logger.info("Admins list was updated into database!");
    }

    @GetMapping("/")
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<Page<User>> getUsers(RequestPage page, String criteria) {
        return ResponseEntity.ok(userCriteriaPort.findAllWithFilters(page, criteriaMapper.convert(criteria)));
    }
}
