package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.User;
import com.atts.tools.msystem.domain.ports.out.UserStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.UserRepository;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserStorageAdapter implements UserStoragePort {

    private final UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return Transformer.transformToUser(userRepository.save(Transformer.transformToUserEntity(user)));
    }

    @Override
    public Set<User> findUsersByUsernames(List<String> usernames) {
        return userRepository.findUsersByUsernameIsIn(usernames).stream().map(
            Transformer::transformToUser
        ).collect(Collectors.toSet());
    }

    @Override
    public void addUsers(List<User> users) {
        userRepository.saveAll(users.stream().map(Transformer::transformToUserEntity).collect(Collectors.toList()));
    }

    @Override
    public void deleteUserByUsername(String username) {
        userRepository.deleteUserByUsername(username);
    }
}
