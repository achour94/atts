package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories;

import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ClientEntity;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<ClientEntity, Integer> {
    Optional<ClientEntity> findClientByReference(String reference);
}
