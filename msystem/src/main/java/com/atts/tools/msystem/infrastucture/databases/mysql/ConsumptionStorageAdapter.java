package com.atts.tools.msystem.infrastucture.databases.mysql;

import com.atts.tools.msystem.domain.model.Consumption;
import com.atts.tools.msystem.domain.ports.out.datastore.ConsumptionStoragePort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.ConsumptionRepository;
import java.util.Collection;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class ConsumptionStorageAdapter implements ConsumptionStoragePort {

    private final ConsumptionRepository consumptionRepository;

    @Override
    public void delete(Collection<Consumption> consumptions) {
        consumptionRepository.deleteAllById(consumptions.stream().map(Consumption::getId).collect(Collectors.toList()));
    }
}
