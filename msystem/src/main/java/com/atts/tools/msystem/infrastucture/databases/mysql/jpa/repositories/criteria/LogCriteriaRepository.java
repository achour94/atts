package com.atts.tools.msystem.infrastucture.databases.mysql.jpa.repositories.criteria;

import com.atts.tools.msystem.domain.logging.Log;
import com.atts.tools.msystem.domain.model.Client;
import com.atts.tools.msystem.domain.model.pageable.RequestPage;
import com.atts.tools.msystem.domain.model.pageable.SearchCriteria;
import com.atts.tools.msystem.domain.ports.out.datastore.LogCriteriaPort;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.ClientEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.entities.LogEntity;
import com.atts.tools.msystem.infrastucture.databases.mysql.jpa.utils.Transformer;
import jakarta.persistence.EntityManager;
import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Repository;

@Repository
public class LogCriteriaRepository implements LogCriteriaPort {

    private final CriteriaRepository<LogEntity, Log> criteriaRepository;

    @Autowired
    public LogCriteriaRepository(EntityManager entityManager, Transformer transformer) {
        this.criteriaRepository = new CriteriaRepository<>(entityManager, LogEntity.class,
            transformer::transformToLog);
    }

    @Override
    public Page<Log> findAllWithFilters(RequestPage page, Collection<SearchCriteria> criteria) {
        return criteriaRepository.findAllWithFilters(page, criteria, null);
    }
}
