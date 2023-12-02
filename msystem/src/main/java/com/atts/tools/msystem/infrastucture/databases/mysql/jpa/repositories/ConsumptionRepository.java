package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories;

import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ConsumptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsumptionRepository extends JpaRepository<ConsumptionEntity, Integer> {

}
