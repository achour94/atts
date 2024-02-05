package com.atts.tools.msystem.common.runners;

import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.out.auth.AuthProvider;
import com.atts.tools.msystem.domain.ports.out.datastore.UserStoragePort;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminsLoader implements ApplicationRunner {

    private final UserStoragePort userStoragePort;
    private final AuthProvider authProvider;
    @Override
    public void run(ApplicationArguments args) throws Exception {
        List<User> users = authProvider.findAllAdminUsers();
        Set<User> adminsFromDb = userStoragePort.findUsersByUsernames(
            users.stream().map(User::getEmail).collect(Collectors.toList()));
        userStoragePort.addUsers(users.stream().filter(user -> !adminsFromDb.contains(user)).collect(Collectors.toList()));
    }
}
