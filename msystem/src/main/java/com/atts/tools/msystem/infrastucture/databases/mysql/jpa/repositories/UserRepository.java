package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories;

import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

}