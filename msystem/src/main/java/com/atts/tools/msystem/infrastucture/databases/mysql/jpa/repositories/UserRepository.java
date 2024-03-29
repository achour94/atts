package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories;

import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.UserEntity;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    void deleteUserByEmail(String username);
    List<UserEntity> findUsersByEmailIsIn(List<String> usernames);
    Optional<UserEntity> findUserEntityByEmail(String username);
}
